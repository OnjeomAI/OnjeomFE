export function formatDotDate(dateText) {
    const date = new Date(dateText);

    if (Number.isNaN(date.getTime())) {
        return dateText;
    }

    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

export function formatKoreanDateTime(dateText) {
    const date = new Date(dateText);

    if (Number.isNaN(date.getTime())) {
        return dateText;
    }

    const period = date.getHours() >= 12 ? "오후" : "오전";
    const hours12 = date.getHours() % 12 || 12;
    const hour = String(hours12).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${period} ${hour}:${minute}`;
}
