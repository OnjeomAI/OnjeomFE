export function getScoreType(score) {
    if (score >= 80) {
        return "good";
    }

    if (score < 60) {
        return "bad";
    }

    return "normal";
}

export function getScoreStatusLabel(score) {
    if (score >= 85) {
        return "우수";
    }

    if (score >= 70) {
        return "보완 필요";
    }

    return "집중 복습";
}

export function getTrendLabel(trend) {
    const labels = {
        stable: "안정적인 추세",
        improving: "상승 추세",
        declining: "하락 주의",
    };

    return labels[trend] || labels.stable;
}

export function getChangeType(change) {
    if (change > 0) {
        return "up";
    }

    if (change < 0) {
        return "down";
    }

    return "none";
}

export function formatStudyDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
        value: `${hours}h`,
        suffix: `${minutes}m`,
    };
}
