import { Button } from "../components/common/Button";
import { Card, CardContent } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Separator } from "../components/common/Separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/common/Tabs";
import { Archive, Code, FileText, Home, Plus, Users } from "lucide-react";
import React from "react";

// ✅ 옵션 문자열 파싱 함수
function parseOptions(optionsString) {
  if (!optionsString) return [];
  return optionsString
    .split(/(?=[A-D]\.)/)
    .map(opt => opt.trim())
    .filter(opt => opt.length > 0);
}

export default function TestQuiz() {
  // ✅ 테스트용 문제 데이터 (백엔드 응답 시 options는 문자열 형태)
  const sampleProblems = [
    {
      question: "TCP/IP 프로토콜의 핵심 기능은?",
      options: "A. 데이터 흐름을 보장하는 방식입니다. B. 통신 기능을 분담하는 방식입니다. C. 하드웨어 드라이버를 포함합니다. D. 전력 소비를 줄입니다.",
      answer: "B",
      explanation: "TCP/IP는 계층 구조를 통해 각 계층이 통신 기능을 분담하여 효율적인 통신을 수행합니다.",
    },
    {
      question: "OSI 7계층 중 전송 계층의 역할은?",
      options: "A. 라우팅 기능 B. 물리적 전송 C. 신뢰성 있는 데이터 전송 D. 사용자 인터페이스 제공",
      answer: "C",
      explanation: "전송 계층은 TCP 등을 이용해 신뢰성 있는 데이터 전송을 담당합니다.",
    }
  ];

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "홈", active: true },
    { icon: <FileText className="w-5 h-5" />, label: "기출 문제", active: false },
    { icon: <Archive className="w-5 h-5" />, label: "자료 보관함", active: false },
    { icon: <Users className="w-5 h-5" />, label: "커뮤니티", active: false },
  ];

  return (
    <div className="bg-[#0f0f0f] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#0f0f0f] w-full max-w-[1440px] h-[1024px] relative">
        {/* Sidebar */}
        <div className="absolute w-72 h-[996px] top-0 left-[18px]">
          <div className="absolute w-[270px] h-[969px] top-[27px] left-3 bg-[#1a1a1a] rounded-[39px] flex flex-col items-center">
            <div className="w-[234px] h-52 relative">
              <img src="" alt="Lecture Lab Logo" className="w-full h-full object-cover" />
            </div>
            <Button className="w-60 h-[54px] mt-2 bg-[#346aff] rounded-lg flex items-center justify-center gap-3">
              <Plus className="w-4 h-4" />
              <span className="font-h300 text-white text-[length:var(--h300-font-size)] leading-[var(--h300-line-height)]">
                New chat
              </span>
            </Button>
            <div className="flex flex-col w-full items-center justify-center gap-5 px-6 py-0 mt-10">
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`flex w-60 items-center gap-3 px-3 py-4 justify-start ${item.active ? "bg-[#2a2f6b4c]" : ""}`}
                >
                  {item.icon}
                  <div className={`font-bold text-base whitespace-nowrap tracking-[0] leading-6 ${item.active ? "text-white" : "text-[#9aa2ac]"}`}>
                    {item.label}
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-auto mb-6 w-[250px]">
              <Separator className="bg-white" />
            </div>
            <Button
              variant="outline"
              className="w-60 h-[52px] mb-8 border-white text-white rounded-xl"
            >
              로그인 / 회원가입
            </Button>
          </div>
        </div>

        {/* Page Counter */}
        <div className="inline-flex items-center gap-2.5 p-2.5 absolute top-[43px] right-[50px]">
          <div className="inline-flex items-center justify-center gap-2.5 p-2.5 relative">
            <div className="relative w-fit font-normal text-[#9aa2ac] text-2xl whitespace-nowrap tracking-[0] leading-6">
              1/{sampleProblems.length}
            </div>
          </div>
          <Code className="w-6 h-6 text-[#9aa2ac]" />
        </div>

        {/* Main Content */}
        <div className="absolute left-[348px] top-[51px]">
          <Input
            className="w-[284px] h-[52px] px-6 py-4 bg-[#1a1a1a] rounded-lg text-white text-2xl"
            placeholder="슬라이드 제목"
            defaultValue="슬라이드 제목"
          />

          <Card className="w-[1044px] h-[856px] mt-[37px] bg-[#1a1a1a] rounded-lg border-none">
            <CardContent className="p-0">
              <Tabs defaultValue="problem" className="w-full">
                <TabsList className="w-full h-[81px] bg-transparent justify-start px-[57px] border-b border-[#333]">
                  <TabsTrigger
                    value="explanation"
                    className="text-2xl data-[state=active]:border-b-2 data-[state=active]:border-[#346aff] rounded-none"
                  >
                    설명 보기
                  </TabsTrigger>
                  <TabsTrigger value="problem" className="text-2xl ml-[106px]">
                    문제 풀기
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="problem" className="px-[45px] py-8">
                  <div className="flex flex-col gap-6">
                    {sampleProblems.map((problem, index) => {
                      const parsedOptions = Array.isArray(problem.options)
                        ? problem.options
                        : parseOptions(problem.options);

                      return (
                        <div key={index} className="bg-[#1e1e1e] text-white p-6 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2">문제 {index + 1}</h3>
                          <p className="mb-3">{problem.question}</p>
                          <ul className="mb-3 space-y-2">
                            {parsedOptions.map((opt, i) => (
                              <li key={i}>
                                <input type="radio" name={`q${index}`} id={`q${index}_opt${i}`} />
                                <label htmlFor={`q${index}_opt${i}`} className="ml-2">{opt}</label>
                              </li>
                            ))}
                          </ul>
                          <div className="text-sm text-green-400">정답: {problem.answer}</div>
                          <div className="text-sm text-gray-400">해설: {problem.explanation}</div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="explanation" className="mt-[52px] flex space-x-[41px] px-[45px]">
                  <div className="w-[455px] h-[682px] bg-[#1e1e1e] flex flex-col items-center justify-center">
                    <div className="text-[#bbbbbb] text-xl">업로드 자료</div>
                  </div>
                  <div className="w-[455px] h-[682px] bg-[#1e1e1e] flex flex-col items-center justify-center">
                    <div className="text-[#bbbbbb] text-xl">자료에 대한 설명</div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
