import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card, CardContent } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Separator } from "../components/common/Separator";
import { FcGoogle } from "react-icons/fc";
import { SiKakaotalk, SiNaver } from "react-icons/si";

export default function RegisterPage() {
  const navigate = useNavigate();

  const socialLoginOptions = [
    {
      name: "Google",
      icon: <FcGoogle className="w-6 h-6" />,
      text: "Google 계정으로 시작하기",
      bgColor: "bg-white",
    },
    {
      name: "Kakao",
      icon: <SiKakaotalk className="w-6 h-6 text-black" />,
      text: "Kakao 계정으로 시작하기",
      bgColor: "bg-[#fee500]",
    },
    {
      name: "Naver",
      icon: <SiNaver className="w-6 h-6 text-white" />,
      text: "Naver 계정으로 시작하기",
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
            {/* Header */}
            <div className="w-full px-8 mt-8">
              <h2 className="text-2xl font-bold text-[#FFFFFF]">회원가입</h2>
              <p className="mt-2 text-base text-[#BBBBBB]">
                회원가입 후 로그인 가능합니다
              </p>
            </div>

            {/* Input Form */}
            <div className="w-full px-8 mt-4 space-y-3">
              <Input
                className="h-[50px] px-4 py-3 bg-white rounded-[10px] border border-[#8abfff] text-[#4e4e4e] text-base"
                placeholder="id"
              />
              <Input
                type="password"
                className="h-[50px] px-4 py-3 bg-white rounded-[10px] border border-[#e6e6e6] text-[#4e4e4e] text-base"
                placeholder="Password"
              />

              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[#4e4e4e] text-sm">이미 계정이 있으신가요?</span>
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#346aff] cursor-pointer text-sm"
                >
                  로그인하기
                </span>
              </div>

              <Button className="w-full h-[45px] mt-3 bg-[#346aff] hover:bg-[#2a55cc] text-white text-base rounded-lg">
                Sign up
              </Button>
            </div>

            {/* Divider */}
            <div className="w-full px-8 mt-4">
              <div className="flex items-center">
                <span className="text-[#4e4e4e] text-sm whitespace-nowrap">
                  Or continue with
                </span>
                <Separator className="flex-grow ml-4 bg-[#4e4e4e]" />
              </div>
            </div>

            {/* Social Buttons */}
            <div className="w-full px-8 mt-4 space-y-3 mb-3">
              {socialLoginOptions.map((login, index) => (
                <Button
                  key={login.name}
                  className={`w-full h-[45px] ${login.bgColor} hover:bg-opacity-90 rounded text-[#4e4e4e] text-sm justify-start px-4 border-none`}
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
