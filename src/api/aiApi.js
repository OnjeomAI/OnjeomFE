import { aiPost } from "./aiClient";

export async function askTutor(payload) {
    return aiPost("/api/tutor/ask", payload);
}

export async function explainTerm(payload) {
    return aiPost("/api/tutor/explain", payload);
}

export async function generateAiProblem(payload) {
    return aiPost("/api/problems/generate", payload);
}

