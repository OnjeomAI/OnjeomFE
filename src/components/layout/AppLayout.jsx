import Sidebar from "./Sidebar";

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
