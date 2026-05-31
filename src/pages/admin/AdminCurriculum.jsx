import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CheckSquare, ListOrdered, Save } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";
import { getAdminProblems, updateCurriculumOrder } from "../../api/adminApi";

function normalizeAdminProblemList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    if (Array.isArray(data?.problems)) {
        return data.problems;
    }

    return [];
}

function AdminCurriculum() {
    const [user, setUser] = useState(null);
    const [problems, setProblems] = useState([]);
    const [selectedProblemIds, setSelectedProblemIds] = useState([]);
    const [curriculumId, setCurriculumId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadPage() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const [nextUser, result] = await Promise.all([
                    getUserByType("admin"),
                    getAdminProblems(0, 100),
                ]);

                if (ignore) {
                    return;
                }

                setUser(nextUser);
                setProblems(normalizeAdminProblemList(result.data));
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(
                        error.message || "커리큘럼 관리 화면을 불러오지 못했습니다."
                    );
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadPage();

        return () => {
            ignore = true;
        };
    }, []);

    const selectedProblems = useMemo(() => {
        return selectedProblemIds
            .map((id) => problems.find((problem) => problem.id === id))
            .filter(Boolean);
    }, [problems, selectedProblemIds]);

    const toggleProblem = (problemId) => {
        setSuccessMessage("");
        setSelectedProblemIds((current) =>
            current.includes(problemId)
                ? current.filter((id) => id !== problemId)
                : [...current, problemId]
        );
    };

    const moveSelectedProblem = (problemId, direction) => {
        setSelectedProblemIds((current) => {
            const index = current.indexOf(problemId);

            if (index < 0) {
                return current;
            }

            const targetIndex = direction === "up" ? index - 1 : index + 1;

            if (targetIndex < 0 || targetIndex >= current.length) {
                return current;
            }

            const next = [...current];
            [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
            return next;
        });
    };

    const handleSave = async () => {
        if (!curriculumId.trim()) {
            setErrorMessage("커리큘럼 ID를 입력해주세요.");
            return;
        }

        if (selectedProblemIds.length === 0) {
            setErrorMessage("순서를 저장할 문제를 하나 이상 선택해주세요.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await updateCurriculumOrder(curriculumId.trim(), selectedProblemIds);
            setSuccessMessage("커리큘럼 순서를 저장했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "커리큘럼 순서 저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    if (errorMessage && !user && !isLoading) {
        return <div>{errorMessage}</div>;
    }

    if (!user) {
        return <div>관리자 정보를 불러오는 중입니다.</div>;
    }

    return (
        <div className="admin-problem-page">
            <PageHeader
                title="커리큘럼"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div className="admin-problem-toolbar">
                <div>
                    <h2>커리큘럼 순서 관리</h2>
                    <p>문제를 선택한 뒤 순서를 바꾸고 기존 reorder API로 저장합니다.</p>
                </div>
            </div>

            {errorMessage ? <p className="admin-problem-error">{errorMessage}</p> : null}
            {successMessage ? <p className="auth-success-message">{successMessage}</p> : null}

            <div className="admin-problem-layout">
                <Card
                    className="admin-problem-list-card"
                    title="문제 선택"
                    subtitle="GET /api/admin/cms/problems"
                >
                    {isLoading ? (
                        <p className="admin-problem-empty">문제 목록을 불러오는 중입니다.</p>
                    ) : problems.length === 0 ? (
                        <p className="admin-problem-empty">선택 가능한 문제가 없습니다.</p>
                    ) : (
                        <div className="admin-curriculum-selection-list">
                            {problems.map((problem) => {
                                const selected = selectedProblemIds.includes(problem.id);

                                return (
                                    <button
                                        key={problem.id}
                                        type="button"
                                        className={`admin-curriculum-selection-item ${
                                            selected ? "active" : ""
                                        }`}
                                        onClick={() => toggleProblem(problem.id)}
                                    >
                                        <div>
                                            <strong>{problem.questionText}</strong>
                                            <span>
                                                ID {problem.id} · {problem.readingType} · 난이도{" "}
                                                {problem.difficulty}
                                            </span>
                                        </div>
                                        <CheckSquare size={18} strokeWidth={2} />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </Card>

                <Card
                    className="admin-problem-detail-card"
                    title="선택 순서"
                    subtitle="PUT /api/admin/cms/curriculum/{curriculumId}/order"
                >
                    <div className="admin-curriculum-config">
                        <label className="admin-form-field">
                            <span>커리큘럼 ID</span>
                            <input
                                value={curriculumId}
                                onChange={(event) => setCurriculumId(event.target.value)}
                                placeholder="예: 1"
                            />
                        </label>

                        <Button
                            variant="primary"
                            size="medium"
                            className="admin-inline-button"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Save size={16} strokeWidth={2} />
                            {isSaving ? "저장 중..." : "순서 저장"}
                        </Button>
                    </div>

                    {selectedProblems.length === 0 ? (
                        <p className="admin-problem-empty">
                            왼쪽 목록에서 문제를 선택하면 커리큘럼 순서를 편집할 수 있습니다.
                        </p>
                    ) : (
                        <div className="admin-curriculum-order-list">
                            {selectedProblems.map((problem, index) => (
                                <div className="admin-curriculum-order-item" key={problem.id}>
                                    <div className="admin-curriculum-order-main">
                                        <span className="admin-curriculum-order-badge">
                                            <ListOrdered size={14} strokeWidth={2} />
                                            {index + 1}
                                        </span>

                                        <div>
                                            <strong>{problem.questionText}</strong>
                                            <p>
                                                문제 ID {problem.id} · {problem.readingType}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="admin-curriculum-order-actions">
                                        <button
                                            type="button"
                                            onClick={() => moveSelectedProblem(problem.id, "up")}
                                            disabled={index === 0}
                                        >
                                            <ArrowUp size={16} strokeWidth={2} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveSelectedProblem(problem.id, "down")}
                                            disabled={index === selectedProblems.length - 1}
                                        >
                                            <ArrowDown size={16} strokeWidth={2} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default AdminCurriculum;
