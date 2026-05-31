import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";
import { getAdminProblems, updateKeywords } from "../../api/adminApi";

function normalizeAdminProblemList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.problems)) return data.problems;
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
    if (!Number.isFinite(numeric)) return 1;
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

                if (!ignore) {
                    setUser(nextUser);
                    setProblems(nextProblems);
                    setSelectedProblemId(nextProblems[0]?.id ?? null);
                    setEditableKeywords(toEditableKeywords(nextProblems[0]));
                }
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(error.message || "Failed to load tag management.");
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
            if (right.count !== left.count) return right.count - left.count;
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
                          [field]: field === "weight" ? clampKeywordWeight(value) : value,
                      }
                    : item
            )
        );
    };

    const handleAddKeyword = () => {
        setEditableKeywords((current) =>
            current.length >= 10 ? current : [...current, { keyword: "", weight: 1 }]
        );
    };

    const handleRemoveKeyword = (index) => {
        setEditableKeywords((current) => current.filter((_, itemIndex) => itemIndex !== index));
    };

    const handleSave = async () => {
        if (!selectedProblem) {
            setErrorMessage("Select a problem first.");
            return;
        }

        const normalizedKeywords = editableKeywords
            .map((item) => ({
                keyword: item.keyword.trim(),
                weight: clampKeywordWeight(item.weight),
            }))
            .filter((item) => item.keyword);

        if (normalizedKeywords.length === 0) {
            setErrorMessage("Enter at least one keyword.");
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
            setSuccessMessage("Keywords saved.");
        } catch (error) {
            setErrorMessage(error.message || "Failed to save keywords.");
        } finally {
            setIsSaving(false);
        }
    };

    if (errorMessage && !user && !isLoading) return <div>{errorMessage}</div>;
    if (!user) return <div>Loading admin profile...</div>;

    return (
        <div className="admin-problem-page">
            <PageHeader
                title="Tag Management"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            {errorMessage ? <p className="admin-problem-error">{errorMessage}</p> : null}
            {successMessage ? <p className="auth-success-message">{successMessage}</p> : null}

            <div className="admin-problem-layout">
                <Card
                    className="admin-problem-list-card"
                    title="Problem List"
                    subtitle="GET /api/admin/cms/problems"
                >
                    {isLoading ? (
                        <p className="admin-problem-empty">Loading problems...</p>
                    ) : (
                        <div className="admin-tag-problem-list">
                            {problems.map((problem) => (
                                <button
                                    key={problem.id}
                                    type="button"
                                    className={`admin-curriculum-selection-item ${selectedProblemId === problem.id ? "active" : ""}`}
                                    onClick={() => handleSelectProblem(problem)}
                                >
                                    <div>
                                        <strong>{problem.questionText}</strong>
                                        <span>ID {problem.id} / Keywords {(problem.keywords || []).length}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </Card>

                <Card
                    className="admin-problem-detail-card"
                    title="Keyword Editor"
                    subtitle="PUT /api/admin/cms/problems/{problemId}/keywords"
                >
                    {!selectedProblem ? (
                        <p className="admin-problem-empty">Select a problem to edit keywords.</p>
                    ) : (
                        <>
                            <div className="admin-problem-section">
                                <h3>{selectedProblem.questionText}</h3>
                                <p>{selectedProblem.passageText || "No passage text."}</p>
                            </div>

                            <div className="admin-tag-edit-list">
                                {editableKeywords.map((item, index) => (
                                    <div className="admin-tag-edit-row" key={`${selectedProblem.id}-${index}`}>
                                        <input
                                            value={item.keyword}
                                            onChange={(event) =>
                                                handleKeywordChange(index, "keyword", event.target.value)
                                            }
                                            placeholder="Keyword"
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={item.weight}
                                            onChange={(event) =>
                                                handleKeywordChange(index, "weight", event.target.value)
                                            }
                                            placeholder="Weight"
                                        />
                                        <button type="button" onClick={() => handleRemoveKeyword(index)}>
                                            <Trash2 size={16} strokeWidth={2} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="admin-problem-action-row">
                                <Button variant="outline" size="medium" onClick={handleAddKeyword}>
                                    <Plus size={16} strokeWidth={2} />
                                    Add Keyword
                                </Button>
                                <Button variant="primary" size="medium" onClick={handleSave} disabled={isSaving}>
                                    <Save size={16} strokeWidth={2} />
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            </div>

            <Card title="Keyword Summary" subtitle="Aggregated from loaded problems">
                {keywordSummary.length === 0 ? (
                    <p className="admin-problem-empty">No keywords found.</p>
                ) : (
                    <div className="admin-stats-grid">
                        {keywordSummary.map((item) => (
                            <div className="admin-tag-summary-item" key={item.keyword}>
                                <strong>{item.keyword}</strong>
                                <span>Used {item.count} times</span>
                                <em>Total weight {item.totalWeight}</em>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default AdminTagManagement;
