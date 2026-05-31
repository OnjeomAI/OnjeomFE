import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";
import { getAdminProblems, updateKeywords } from "../../api/adminApi";

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

function toEditableKeywords(problem) {
    return Array.isArray(problem?.keywords)
        ? problem.keywords.map((item) => ({
              keyword: item.keyword || "",
              weight: item.weight || 1,
          }))
        : [];
}

function clampKeywordWeight(value) {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
        return 1;
    }

    return Math.max(1, Math.min(100, numeric));
}

function AdminTagManagement() {
    const [user, setUser] = useState(null);
    const [problems, setProblems] = useState([]);
    const [selectedProblemId, setSelectedProblemId] = useState(null);
    const [editableKeywords, setEditableKeywords] = useState([]);
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
                const nextProblems = normalizeAdminProblemList(result.data);

                if (ignore) {
                    return;
                }

                setUser(nextUser);
                setProblems(nextProblems);
                setSelectedProblemId(nextProblems[0]?.id ?? null);
                setEditableKeywords(toEditableKeywords(nextProblems[0]));
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(
                        error.message || "태그 관리 화면을 불러오지 못했습니다."
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

    const selectedProblem = useMemo(() => {
        return problems.find((problem) => problem.id === selectedProblemId) || null;
    }, [problems, selectedProblemId]);

    const keywordSummary = useMemo(() => {
        const stats = new Map();

        problems.forEach((problem) => {
            (problem.keywords || []).forEach((item) => {
                const current = stats.get(item.keyword) || {
                    keyword: item.keyword,
                    count: 0,
                    totalWeight: 0,
                };

                current.count += 1;
                current.totalWeight += item.weight || 0;
                stats.set(item.keyword, current);
            });
        });

        return [...stats.values()].sort((left, right) => {
            if (right.count !== left.count) {
                return right.count - left.count;
            }

            return right.totalWeight - left.totalWeight;
        });
    }, [problems]);

    const handleSelectProblem = (problem) => {
        setSelectedProblemId(problem.id);
        setEditableKeywords(toEditableKeywords(problem));
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleKeywordChange = (index, field, value) => {
        setEditableKeywords((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]:
                              field === "weight"
                                  ? clampKeywordWeight(value)
                                  : value,
                      }
                    : item
            )
        );
    };

    const handleAddKeyword = () => {
        setEditableKeywords((current) => [...current, { keyword: "", weight: 1 }]);
    };

    const handleRemoveKeyword = (index) => {
        setEditableKeywords((current) => current.filter((_, itemIndex) => itemIndex !== index));
    };

    const handleSave = async () => {
        if (!selectedProblem) {
            setErrorMessage("문제를 먼저 선택해주세요.");
            return;
        }

        const normalizedKeywords = editableKeywords
            .map((item) => ({
                keyword: item.keyword.trim(),
                weight: clampKeywordWeight(item.weight),
            }))
            .filter((item) => item.keyword);

        if (normalizedKeywords.length === 0) {
            setErrorMessage("최소 한 개 이상의 키워드를 입력해주세요.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await updateKeywords(selectedProblem.id, { keywords: normalizedKeywords });

            setProblems((current) =>
                current.map((problem) =>
                    problem.id === selectedProblem.id
                        ? { ...problem, keywords: normalizedKeywords }
                        : problem
                )
            );
            setSuccessMessage("키워드 정보를 저장했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "키워드 저장에 실패했습니다.");
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
                title="태그 관리"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div className="admin-problem-toolbar">
                <div>
                    <h2>문제별 키워드 관리</h2>
                    <p>문제를 선택하고 키워드와 가중치를 수정한 뒤 바로 저장할 수 있습니다.</p>
                </div>
            </div>

            {errorMessage ? <p className="admin-problem-error">{errorMessage}</p> : null}
            {successMessage ? <p className="auth-success-message">{successMessage}</p> : null}

            <div className="admin-problem-layout">
                <Card
                    className="admin-problem-list-card"
                    title="문제 목록"
                    subtitle="GET /api/admin/cms/problems"
                >
                    {isLoading ? (
                        <p className="admin-problem-empty">문제 목록을 불러오는 중입니다.</p>
                    ) : (
                        <div className="admin-tag-problem-list">
                            {problems.map((problem) => (
                                <button
                                    key={problem.id}
                                    type="button"
                                    className={`admin-curriculum-selection-item ${
                                        selectedProblemId === problem.id ? "active" : ""
                                    }`}
                                    onClick={() => handleSelectProblem(problem)}
                                >
                                    <div>
                                        <strong>{problem.questionText}</strong>
                                        <span>
                                            ID {problem.id} · 키워드 {(problem.keywords || []).length}개
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </Card>

                <Card
                    className="admin-problem-detail-card"
                    title="키워드 편집"
                    subtitle="PUT /api/admin/cms/problems/{problemId}/keywords"
                >
                    {!selectedProblem ? (
                        <p className="admin-problem-empty">편집할 문제를 선택해주세요.</p>
                    ) : (
                        <div className="admin-tag-editor">
                            <div className="admin-tag-editor-header">
                                <div>
                                    <strong>{selectedProblem.questionText}</strong>
                                    <p>문제 ID {selectedProblem.id}</p>
                                </div>

                                <Button
                                    variant="primary"
                                    size="medium"
                                    className="admin-inline-button"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    <Save size={16} strokeWidth={2} />
                                    {isSaving ? "저장 중..." : "키워드 저장"}
                                </Button>
                            </div>

                            <div className="admin-tag-edit-list">
                                {editableKeywords.map((item, index) => (
                                    <div className="admin-tag-edit-row" key={`${index}-${item.keyword}`}>
                                        <input
                                            value={item.keyword}
                                            onChange={(event) =>
                                                handleKeywordChange(
                                                    index,
                                                    "keyword",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="키워드"
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={item.weight}
                                            onChange={(event) =>
                                                handleKeywordChange(
                                                    index,
                                                    "weight",
                                                    event.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveKeyword(index)}
                                        >
                                            <Trash2 size={16} strokeWidth={2} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="medium"
                                className="admin-inline-button"
                                onClick={handleAddKeyword}
                            >
                                <Plus size={16} strokeWidth={2} />
                                키워드 추가
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            <Card
                className="admin-problem-detail-card"
                title="전체 키워드 요약"
                subtitle="현재 불러온 문제 목록 기준 집계"
            >
                {keywordSummary.length === 0 ? (
                    <p className="admin-problem-empty">집계할 키워드가 없습니다.</p>
                ) : (
                    <div className="admin-tag-summary-grid">
                        {keywordSummary.map((item) => (
                            <div className="admin-tag-summary-item" key={item.keyword}>
                                <strong>{item.keyword}</strong>
                                <span>등장 {item.count}회</span>
                                <em>가중치 합 {item.totalWeight}</em>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default AdminTagManagement;
