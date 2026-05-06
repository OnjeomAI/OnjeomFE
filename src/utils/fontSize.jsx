export function applyAppFontSize(fontSize = 100) {
    const safeFontSize = Math.min(120, Math.max(80, Number(fontSize) || 100));
    const scale = safeFontSize / 100;

    document.documentElement.style.setProperty("--app-font-scale", scale);
    localStorage.setItem("onjeom-font-size", String(safeFontSize));
}

export function loadSavedAppFontSize() {
    const savedFontSize = localStorage.getItem("onjeom-font-size");

    if (savedFontSize) {
        applyAppFontSize(Number(savedFontSize));
    } else {
        applyAppFontSize(100);
    }
}