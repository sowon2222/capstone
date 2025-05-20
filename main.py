from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
import models
from database import get_db
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from slide_analyzer import analyze_pdf as conceptmap_analyze_pdf

# === ML 관련 추가 ===
from transformers import MT5ForConditionalGeneration, AutoTokenizer
from peft import PeftModel
import torch
import re

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

base_model_1 = MT5ForConditionalGeneration.from_pretrained("google/mt5-base")
model1 = PeftModel.from_pretrained(base_model_1, "./lora_step1_question_model/lora_adapter")
model1 = model1.merge_and_unload().to(device).eval()

base_model_2 = MT5ForConditionalGeneration.from_pretrained("google/mt5-base")
model2 = PeftModel.from_pretrained(base_model_2, "./lora_step2_answer_model/lora_adapter")
model2 = model2.merge_and_unload().to(device).eval()

tokenizer = AutoTokenizer.from_pretrained("google/mt5-base")
tokenizer.padding_side = "right"

# === FastAPI 설정 ===
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# === 인증 관련 함수 ===
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user

# === 모델용 Pydantic 정의 ===
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class QuizRequest(BaseModel):
    summary: str

class QuizItem(BaseModel):
    question: str
    options: str
    answer: str
    explanation: str
    message: Optional[str] = None

# === 사용자 인증 API ===
@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me/")
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return {"username": current_user.username, "email": current_user.email, "id": current_user.id}

# === 파일 업로드 및 분석 ===
@app.post("/files/upload/")
async def upload_file(file: UploadFile = File(...), user_id: int = None, db: Session = Depends(get_db)):
    file_location = f"temp_files/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(await file.read())
    db_file = models.File(
        user_id=user_id,
        original_filename=file.filename,
        stored_filename=file_location,
        file_type=file.content_type,
        file_size=os.path.getsize(file_location)
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

@app.get("/files/{file_id}/analysis/")
def get_file_analysis(file_id: int, db: Session = Depends(get_db)):
    return db.query(models.AnalysisResult).filter(models.AnalysisResult.file_id == file_id).all()

@app.post("/files/{file_id}/analysis/")
def create_analysis(file_id: int, analysis_type: str, result_data: dict, db: Session = Depends(get_db)):
    db_analysis = models.AnalysisResult(file_id=file_id, analysis_type=analysis_type, result_data=result_data)
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

@app.post("/analyze-pdf")
async def analyze_pdf_endpoint(file: UploadFile = File(...)):
    return await conceptmap_analyze_pdf(file)

# === Quiz 생성 엔드포인트 ===
@app.post("/generate_quiz", response_model=QuizItem)
def generate_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    summary_text = request.summary.strip()
    if not summary_text:
        raise HTTPException(status_code=400, detail="summary 필드는 비어 있을 수 없습니다.")

    # 문제 + 보기 생성
    prompt1 = (
        f"다음 내용을 바탕으로 객관식 문제와 보기 A~D를 생성하세요. "
        f"보기 순서는 A~D이고 보기 문장은 간결하게 작성하세요.\n\n{summary_text}"
    )
    inputs1 = tokenizer(prompt1, return_tensors="pt", truncation=True, padding="max_length", max_length=512).to(device)
    outputs1 = model1.generate(
        **inputs1,
        max_length=384,
        num_beams=4,
        no_repeat_ngram_size=3,
        repetition_penalty=1.5,
        early_stopping=True,
        pad_token_id=tokenizer.pad_token_id
    )
    step1_text = tokenizer.decode(outputs1[0], skip_special_tokens=True).strip()
    step1_text = re.sub(r"\s{2,}", " ", step1_text)

    # 정답 + 해설 생성
    prompt2 = (
        f"다음 문제에 대해 정답과 해설을 생성하세요. "
        f"정답은 보기 중 하나를 정확히 선택하고 해설은 구체적으로 작성하세요.\n\n{step1_text}"
    )
    inputs2 = tokenizer(prompt2, return_tensors="pt", truncation=True, padding="max_length", max_length=512).to(device)
    outputs2 = model2.generate(
        **inputs2,
        max_length=256,
        num_beams=4,
        no_repeat_ngram_size=3,
        repetition_penalty=1.5,
        early_stopping=True,
        pad_token_id=tokenizer.pad_token_id
    )
    step2_text = tokenizer.decode(outputs2[0], skip_special_tokens=True).strip()

    # 파싱
    question = step1_text.split("A.")[0].replace("문제:", "").strip()
    options = step1_text[len(question):].strip()

    answer_match = re.search(r"정답[:：]?\s*(.+?)($|\n)", step2_text)
    explanation_match = re.search(r"해설[:：]?\s*(.+)", step2_text)

    answer = answer_match.group(1).strip() if answer_match else "미확인"
    explanation = explanation_match.group(1).strip() if explanation_match else "미확인"

    # 중복 체크 후 DB 저장
    existing = db.query(models.QuizResult).filter_by(question=question).first()
    if existing:
        return QuizItem(
            question=existing.question,
            options=existing.options,
            answer=existing.answer,
            explanation=existing.explanation,
            message="Quiz already exists; returning saved data."
        )

    new_quiz = models.QuizResult(
        question=question,
        options=options,
        answer=answer,
        explanation=explanation
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    return QuizItem(
        question=question,
        options=options,
        answer=answer,
        explanation=explanation,
        message=None
    )