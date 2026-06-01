const RAW_AI_API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL;
const AI_API_BASE_URL =
    typeof RAW_AI_API_BASE_URL === "string" ? RAW_AI_API_BASE_URL.trim() : "";

function getValidatedAiApiBaseUrl() {
    if (!AI_API_BASE_URL) {
        throw new Error("VITE_AI_API_BASE_URL이 설정되지 않았습니다.");
    }

    try {
        return new URL(AI_API_BASE_URL).toString().replace(/\/$/, "");
    } catch {
        throw new Error(
            `AI API Base URL 값이 올바르지 않습니다: ${String(AI_API_BASE_URL)}`
        );
    }
}

function buildAiUrl(path) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${getValidatedAiApiBaseUrl()}${normalizedPath}`;
}

function toSnakeCase(value) {
    return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toSnakeCaseObject(value) {
    if (Array.isArray(value)) {
        return value.map(toSnakeCaseObject);
    }

    if (!value || typeof value !== "object") {
        return value;
    }

    return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
            toSnakeCase(key),
            toSnakeCaseObject(item),
        ])
    );
}

function toCamelCase(value) {
    return value.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function toCamelCaseObject(value) {
    if (Array.isArray(value)) {
        return value.map(toCamelCaseObject);
    }

    if (!value || typeof value !== "object") {
        return value;
    }

    return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
            toCamelCase(key),
            toCamelCaseObject(item),
        ])
    );
}

async function parseAiResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        return response.text();
    }

    return response.json();
}

export async function aiPost(path, body) {
    const response = await fetch(buildAiUrl(path), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(toSnakeCaseObject(body || {})),
    });
    const parsed = await parseAiResponse(response);

    if (!response.ok) {
        const message =
            parsed?.detail ||
            parsed?.message ||
            (typeof parsed === "string" ? parsed : "AI API request failed.");
        throw new Error(message);
    }

    return toCamelCaseObject(parsed);
}

export async function aiGet(path) {
    const response = await fetch(buildAiUrl(path), {
        headers: {
            "ngrok-skip-browser-warning": "true",
        },
    });
    const parsed = await parseAiResponse(response);

    if (!response.ok) {
        throw new Error(parsed?.detail || parsed?.message || "AI API request failed.");
    }

    return toCamelCaseObject(parsed);
}
