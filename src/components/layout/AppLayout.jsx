import Sidebar from "./sidebar";

function AppLayout({ children, type = "learner" }) {
    return (
        <div className="app-layout">
            <Sidebar type={type} />

            <main className="app-main">
                {children}
            </main>
        </div>
    );
}

export default AppLayout;