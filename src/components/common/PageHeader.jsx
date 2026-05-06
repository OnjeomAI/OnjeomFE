import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, CircleUserRound } from "lucide-react";

function PageHeader({
    subtitle,
    title,
    type = "learner",
    backTo,
    showBack = true,
    status,
    userName = "unknown",
    userLevel = "not level",
    showBell = true,
    showUser = true,
    className = "",
})
{
    const navigate = useNavigate();

    const defaultBackPath = type === "admin" ? "/admin/question" : "/dashboard";
    const targetPath = backTo || defaultBackPath;

    const headerClassName = ["page-header", className].filter(Boolean).join(" ");

    const handleBackClick = () => {
        navigate(targetPath);
    };

    return (
        <header className={headerClassName}>
            <div className="page-header-left">
                {showBack && (
                    <button
                        type="button"
                        className="page-header-back-button"
                        onClick={handleBackClick}
                        aria-label="이전 화면으로 이동"
                    >
                        <ArrowLeft size={22} strokeWidth={2.2} />
                    </button>
                )}

                <div className="page-header-title-area">
                    {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
                    <h1 className="page-header-title">{title}</h1>
                </div>
            </div>

            <div className="page-header-right">
                {status && <span className="page-header-status">{status}</span>}

                {showBell && (
                    <button className="page-header-icon-button" type="button">
                        <Bell size={21} strokeWidth={2} />
                    </button>
                )}

                {showUser && (
                    <div className="page-header-user">
                        <div className="page-header-user-text">
                            <strong>{userName}</strong>
                            {userLevel && <span>{userLevel}</span>}
                        </div>

                        <CircleUserRound size={30} strokeWidth={2} />
                    </div>
                )}
            </div>
        </header>
    );
}

export default PageHeader;