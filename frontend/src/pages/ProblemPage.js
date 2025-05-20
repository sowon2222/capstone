import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionListSection from "../components/problem/QuestionListSection";
import ContentDisplaySection from "../components/problem/ContentDisplaySection";

export default function ProblemPage() {
  const [current, setCurrent] = useState(1);
  const navigate = useNavigate();

  // ✅ 테스트용 문제 데이터
  const sampleProblems = [
    {
      question: "TCP의 특징으로 옳지 않은 것은 무엇인가?",
      options: [
        "연결 지향적이다.",
        "오류 제어를 제공한다.",
        "3-way handshake를 사용한다.",
        "데이터그램 방식을 사용한다.",
      ],
      answer: "데이터그램 방식을 사용한다.",
      explanation: "데이터그램은 비연결형인 UDP의 특징입니다.",
    },
    {
      question: "TCP가 연결을 설정할 때 사용하는 절차는?",
      options: [
        "2-way handshake",
        "3-way handshake",
        "4-way handshake",
        "ARP 요청",
      ],
      answer: "3-way handshake",
      explanation: "TCP는 연결 설정 시 3-way handshake를 수행합니다.",
    },
    {
      question: "TCP의 흐름 제어를 위한 대표적인 기법은 무엇인가?",
      options: [
        "슬라이딩 윈도우",
        "라우팅 테이블",
        "혼잡 회피",
        "시퀀스 넘버링",
      ],
      answer: "슬라이딩 윈도우",
      explanation: "흐름 제어는 슬라이딩 윈도우 방식으로 수행됩니다.",
    },
    // 필요한 만큼 문제 추가 (총 10개까지 확장 가능)
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-[#0f0f0f]">
      {/* 상단 제목/페이지 */}
      <div className="flex justify-between items-center px-12 py-6 flex-shrink-0">
        <div className="text-lg font-bold text-white truncate">강의자료.pdf</div>
        <div className="text-base text-[#9aa2ac] font-normal">
          {current}/{sampleProblems.length}
        </div>
      </div>

      {/* 카드 및 탭 */}
      <div className="flex-1 min-h-0 flex justify-center items-center px-8 pb-8">
        <div className="w-full h-full bg-[#18181b] rounded-2xl border-none shadow-lg flex flex-col">
          {/* 탭 메뉴 */}
          <div className="h-14 bg-transparent border-b border-[#333] px-10 flex-shrink-0 flex items-center">
            <button
              onClick={() => navigate("/slide-summary")}
              className="text-base px-8 py-2 text-[#bbbbbb] hover:text-white transition-colors"
            >
              설명 보기
            </button>
            <button className="text-base px-8 py-2 ml-8 border-b-2 border-[#346aff] text-white font-semibold">
              문제 풀기
            </button>
            <button
              onClick={() => navigate("/concept-map")}
              className="text-base px-8 py-2 ml-8 text-[#bbbbbb] hover:text-white transition-colors"
            >
              개념 맵
            </button>
          </div>

          {/* 문제 번호 리스트 + 문제 내용 */}
          <div className="flex-1 min-h-0 flex flex-row gap-8 px-10 py-8">
            <QuestionListSection current={current} onNumberClick={setCurrent} />
            <ContentDisplaySection
              current={current}
              setCurrent={setCurrent}
              problems={sampleProblems} // ✅ 문제 데이터 전달
            />
          </div>
        </div>
      </div>
    </div>
  );
}
