import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    RefreshCcw,
    BarChart3,
    User,
    Tags,
    LogOut,
    FileQuestion,
} from "lucide-react";

const learnerLinks  = [
    { to: "/dashboard", label: "대시보드", icon: LayoutDashboard },
    { to: "/today", label: "오늘의 학습", icon: BookOpen },
    { to: "/review", label: "복습하기", icon: RefreshCcw },
    { to: "/history", label: "학습 기록", icon: BarChart3 },
    { to: "/profile", label: "프로필 설정", icon: User },
];

const adminLinks = [
    { to: "/admin/cms", label: "문항 관리", icon: FileQuestion },
    { to: "/admin/curriculum", label: "커리큘럼", icon: BookOpen },
    { to: "/admin/tags", label: "태그 관리", icon: Tags },
    { to: "/admin/stats", label: "통계 분석", icon: BarChart3 },
    { to: "/admin/profile", label: "프로필 설정", icon: User },
];

function Sidebar({ type = "learner" }) {
    const links = type === "admin" ? adminLinks : learnerLinks;

    return (
        <aside className="sidebar">
            <div>
                <div className="sidebar-logo-area">
                    <div className="sidebar-logo">
                        <span className="sidebar-logo-dot"></span>
                        <span>온점</span>
                    </div>

                    <p className="sidebar-subtitle">DIGITAL ARCHIVIST</p>
                </div>

                <nav className="sidebar-nav">
                    {links.map((link) => {
                        const Icon = link.icon;

                        return (
                            <NavLink key={link.to} to={link.to} className="sidebar-link">
                                <Icon size={19} strokeWidth={1.8} />
                                <span>{link.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <button className="sidebar-logout-button">
                <LogOut size={15} />
                <span>로그아웃</span>
            </button>
        </aside>
    );
}

export default Sidebar;