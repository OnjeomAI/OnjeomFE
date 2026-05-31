import { askTutor } from "../../api/aiApi";

export async function askAiTutor({ question, problemId, passageText }) {
    const payload = { question };

    if (problemId !== undefined && problemId !== null) {
        payload.problemId = problemId;
    }

    if (passageText) {
        payload.passageText = passageText;
    }

    const result = await askTutor(payload);

    return result.data || null;
}

