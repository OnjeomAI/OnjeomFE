import { getAccessToken } from "../../utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

async function requestAiTutor(payload) {
    const response = await fetch(`${apiBaseUrl}/api/ai/tutor`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok || !result?.success) {
        throw new Error(result?.message || "AI 튜터 답변을 불러오지 못했습니다.");
    }

    return result.data || null;
}

export async function askAiTutor({ question, problemId, passageText }) {
    const payload = {
        question,
    };

    if (problemId !== undefined && problemId !== null) {
        payload.problemId = problemId;
    }

    if (passageText) {
        payload.passageText = passageText;
    }

    return requestAiTutor(payload);
}
