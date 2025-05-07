import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Archive, Users, PlusCircle } from "lucide-react";

const menuItems = [
  { label: "홈", icon: <Home />, path: "/" },
  { label: "기출 문제", icon: <FileText />, path: "/problems" },
  { label: "자료 보관함", icon: <Archive />, path: "/archive" },
  { label: "커뮤니티", icon: <Users />, path: "/community" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-[#18181b] rounded-3xl flex flex-col p-6">
      {/* 로고 */}
      <div className="mb-8 flex items-center h-16 cursor-pointer" onClick={() => navigate("/")}>
        <img src="/site_logo_n.png" alt="LECTURE LAB" className="h-full" />
      </div>
      {/* New chat 버튼 */}
      <button className="h-12 bg-[#346aff] rounded-lg text-white font-medium mb-8 flex items-center justify-center gap-3">
        <PlusCircle className="w-5 h-5" />
        New chat
      </button>
      {/* 메뉴 */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${location.pathname === item.path
                ? "bg-[#2a2f6b4c] text-white font-semibold"
                : "text-[#9aa2ac] hover:bg-[#2a2f6b4c]"}
            `}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {/* 하단 로그인/회원가입 */}
      <div className="mt-auto">
        <hr className="my-6 border-[#333]" />
        <button
          className="w-full h-12 border border-white text-white rounded-lg hover:bg-white hover:text-[#18181b] transition-colors"
          onClick={() => navigate("/login")}
        >
          로그인 / 회원가입
        </button>
      </div>
    </aside>
  );
}