import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card, CardContent } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Separator } from "../components/common/Separator";
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk, SiNaver } from "react-icons/si";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: 백엔드 API 호출
      // 로그인 성공 시 토큰 발급
      // 로그인 살패 시 오류 메시지 반환
      
      // const userData = await response.json();
      const userData = { id, name: "테스트 사용자" }; // 임시 데이터
      
      await login(userData);
      navigate("/");
    } catch (error) {
      setError(error.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      // TODO: 소셜 로그인 API 호출
      // 소셜 로그인 성공 시 토큰 발급
      // 소셜 로그인 실패 시 오류 메시지 반환
      
      const userData = { id: `${provider}_user`, name: `${provider} 사용자` }; // 임시 데이터
      await login(userData);
      navigate("/");
    } catch (error) {
      setError(`${provider} 로그인 중 오류가 발생했습니다.`);
    }
  };

  const socialLogins = [
    {
      name: "Google",
      icon: <FcGoogle className="w-6 h-6" />,
      text: "Google 계정으로 로그인",
      bgColor: "bg-white",
    },
    {
      name: "Kakao",
      icon: <SiKakaotalk className="w-6 h-6 text-black" />,
      text: "Kakao 계정으로 로그인",
      bgColor: "bg-[#fee500]",
    },
    {
      name: "Naver",
      icon: <SiNaver className="w-6 h-6 text-white" />,
      text: "Naver 계정으로 로그인",
      bgColor: "bg-[#03C75A]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* 로고 */}
      <div className="pt-2 flex justify-center">
        <img src="/site_logo_n.png" alt="Netiva" className="h-16" onClick={() => navigate("/")} style={{ cursor: 'pointer' }} />
      </div>
      {/* 중앙 정렬 영역 */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-[480px] bg-[#1a1a1a] rounded-lg shadow border-none">
          <CardContent className="p-0 flex flex-col items-center">
            {/* Login Header */}
            <div className="w-full px-8 mt-8">
              <h2 className="text-2xl font-bold text-[#FFFFFF]">로그인</h2>
              <p className="mt-2 text-base text-[#BBBBBB]">
                회원가입 후 로그인 가능합니다
              </p>
            </div>

            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className="w-full px-8 mt-4 space-y-3">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Input
                className="h-[50px] px-4 py-3 bg-white rounded-[10px] border border-[#8abfff] text-[#4e4e4e] text-base"
                placeholder="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="password"
                className="h-[50px] px-4 py-3 bg-white rounded-[10px] border border-[#e6e6e6] text-[#4e4e4e] text-base"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[#4e4e4e] text-sm">계정이 없으신가요?</span>
                <span
                  onClick={() => navigate("/register")}
                  className="text-[#346aff] cursor-pointer text-sm"
                >
                  가입하기
                </span>
              </div>
              <Button 
                type="submit"
                className="w-full h-[45px] mt-3 bg-[#346aff] hover:bg-[#2a55cc] text-white text-base rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "Log in"}
              </Button>
            </form>

            {/* Divider */}
            <div className="w-full px-8 mt-4">
              <div className="flex items-center">
                <span className="text-[#4e4e4e] text-sm whitespace-nowrap">
                  Or continue with
                </span>
                <Separator className="flex-grow ml-4 bg-[#4e4e4e]" />
              </div>
            </div>

            {/* 소셜 버튼 */}
            <div className="w-full px-8 mt-4 space-y-3 mb-3">
              {socialLogins.map((login) => (
                <Button
                  key={login.name}
                  className={`w-full h-[45px] ${login.bgColor} hover:bg-opacity-90 rounded text-[#4e4e4e] text-sm justify-start px-4 border-none`}
                  onClick={() => handleSocialLogin(login.name.toLowerCase())}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <span className="mr-4">{login.icon}</span>
                    <span>{login.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
