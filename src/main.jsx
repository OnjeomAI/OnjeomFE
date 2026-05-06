import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.jsx";
import { loadSavedAppFontSize } from "./utils/fontSize";

loadSavedAppFontSize();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);