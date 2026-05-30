// API 원천 날짜 문자열을 화면 표시용 날짜 포맷으로 변환합니다.
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

    const period = date.getHours() >= 12 ? "PM" : "AM";
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 · ${hour}:${minute} ${period}`;
}
