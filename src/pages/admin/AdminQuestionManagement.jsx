import { useEffect, useMemo, useState } from "react";
import { Bot, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";
import { getProblemDetail } from "../../data/services/problemService";
import {
    createAdminProblem,
    deleteAdminProblem,
    generateProblem,
    getAdminProblems,
    reindexProblem,
    updateAdminProblem,
} from "../../api/adminApi";

const readingTypeOptions = [
    { label: "All", value: "ALL" },
    { label: "Factual", value: "FACTUAL" },
    { label: "Inferential", value: "INFERENTIAL" },
    { label: "Critical", value: "CRITICAL" },
    { label: "Creative", value: "CREATIVE" },
];

const problemTypeOptions = [
    { label: "Multiple Choice", value: "MULTIPLE_CHOICE" },
    { label: "Short Answer", value: "SHORT_ANSWER" },
];

function createKeywordItem() {
    return { keyword: "", weight: 10 };
}

function createProblemForm() {
    return {
        passageText: "",
        questionText: "",
        problemType: "SHORT_ANSWER",
        readingType: "FACTUAL",
        difficulty: 3,
        modelAnswer: "",
        keywords: [createKeywordItem()],
    };
}

function createGenerateForm() {
    return { readingType: "FACTUAL", difficulty: 3, topic: "" };
}

function normalizeAdminProblemList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.problems)) return data.problems;
    return [];
}

function normalizeKeywords(keywords = []) {
    return keywords.map((item) => ({ keyword: item.keyword || "", weight: Number(item.weight) || 1 }));
}

function toUpdateForm(problem) {
    return {
        passageText: problem?.passageText || "",
        questionText: problem?.questionText || "",
        readingType: problem?.readingType || "FACTUAL",
        difficulty: Number(problem?.difficulty) || 3,
        modelAnswer: problem?.modelAnswer || "",
    };
}

function formatDate(value) {
    if (!value) return "-";
    return value.replace("T", " ").slice(0, 16);
}

function clampDifficulty(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.max(1, Math.min(5, numeric));
}

function clampKeywordWeight(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.max(1, Math.min(100, numeric));
}

function AdminQuestionManagement() {
    const [user, setUser] = useState(null);
    const [readingType, setReadingType] = useState("ALL");
    const [page, setPage] = useState(0);
    const [problems, setProblems] = useState([]);
    const [selectedProblemId, setSelectedProblemId] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [createForm, setCreateForm] = useState(createProblemForm);
    const [generateForm, setGenerateForm] = useState(createGenerateForm);
    const [updateForm, setUpdateForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReindexing, setIsReindexing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const filteredProblems = useMemo(() => {
        if (readingType === "ALL") return problems;
        return problems.filter((problem) => problem.readingType === readingType);
    }, [problems, readingType]);

    useEffect(() => {
        getUserByType("admin").then(setUser);
    }, []);

    const loadCurrentPageProblems = async () => {
        const result = await getAdminProblems(page, 20);
        const nextProblems = normalizeAdminProblemList(result.data);
        setProblems(nextProblems);
        return nextProblems;
    };

    useEffect(() => {
        let ignore = false;

        async function loadProblems() {
            setLoading(true);
            setErrorMessage("");

            try {
                const result = await getAdminProblems(page, 20);
                const nextProblems = normalizeAdminProblemList(result.data);
                if (ignore) return;

                setProblems(nextProblems);
                setSelectedProblemId((currentId) => {
                    const hasCurrent = nextProblems.some((problem) => problem.id === currentId);
                    return hasCurrent ? currentId : nextProblems[0]?.id ?? null;
                });
            } catch (error) {
                if (!ignore) {
                    setProblems([]);
                    setSelectedProblemId(null);
                    setSelectedProblem(null);
                    setUpdateForm(null);
                    setErrorMessage(error.message || "Failed to load problems.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadProblems();
        return () => {
            ignore = true;
        };
    }, [page]);

    useEffect(() => {
        let ignore = false;

        async function loadDetail() {
            if (!selectedProblemId) {
                setSelectedProblem(null);
                setUpdateForm(null);
                return;
            }

            setDetailLoading(true);

            try {
                const detail = await getProblemDetail(selectedProblemId);
                if (ignore) return;
                setSelectedProblem(detail);
                setUpdateForm(toUpdateForm(detail));
            } catch (error) {
                if (!ignore) {
                    setSelectedProblem(null);
                    setUpdateForm(null);
                    setErrorMessage(error.message || "Failed to load problem detail.");
                }
            } finally {
                if (!ignore) setDetailLoading(false);
            }
        }

        loadDetail();
        return () => {
            ignore = true;
        };
    }, [selectedProblemId]);

    const handleCreateFieldChange = (field, value) => {
        setCreateForm((current) => ({ ...current, [field]: field === "difficulty" ? clampDifficulty(value) : value }));
    };

    const handleCreateKeywordChange = (index, field, value) => {
        setCreateForm((current) => ({
            ...current,
            keywords: current.keywords.map((item, itemIndex) =>
                itemIndex === index
                    ? { ...item, [field]: field === "weight" ? clampKeywordWeight(value) : value }
                    : item
            ),
        }));
    };

    const handleAddCreateKeyword = () => {
        setCreateForm((current) => ({
            ...current,
            keywords: current.keywords.length >= 10 ? current.keywords : [...current.keywords, createKeywordItem()],
        }));
    };

    const handleRemoveCreateKeyword = (index) => {
        setCreateForm((current) => ({
            ...current,
            keywords: current.keywords.filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const validateCreateForm = () => {
        if (!createForm.passageText.trim()) return "Enter passage text.";
        if (!createForm.questionText.trim()) return "Enter question text.";
        if (!createForm.modelAnswer.trim()) return "Enter model answer.";
        if (createForm.keywords.length > 10) return "You can register up to 10 keywords.";
        const invalidKeyword = createForm.keywords.find((item) => item.keyword.trim() && (item.weight < 1 || item.weight > 100));
        if (invalidKeyword) return "Keyword weight must be between 1 and 100.";
        return "";
    };

    const handleCreateProblem = async () => {
        const validationMessage = validateCreateForm();
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        setIsCreating(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await createAdminProblem({
                ...createForm,
                difficulty: clampDifficulty(createForm.difficulty),
                keywords: createForm.keywords
                    .map((item) => ({ keyword: item.keyword.trim(), weight: clampKeywordWeight(item.weight) }))
                    .filter((item) => item.keyword),
            });
            const nextProblems = await loadCurrentPageProblems();
            setCreateForm(createProblemForm());
            setSelectedProblemId(nextProblems[0]?.id ?? null);
            setSuccessMessage("Problem created.");
        } catch (error) {
            setErrorMessage(error.message || "Failed to create problem.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleGenerateFieldChange = (field, value) => {
        setGenerateForm((current) => ({ ...current, [field]: field === "difficulty" ? clampDifficulty(value) : value }));
    };

    const handleGenerateProblem = async () => {
        setIsGenerating(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await generateProblem({ ...generateForm, difficulty: clampDifficulty(generateForm.difficulty) });
            await loadCurrentPageProblems();
            setSuccessMessage("Problem generated.");
        } catch (error) {
            setErrorMessage(error.message || "Failed to generate problem.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpdateFieldChange = (field, value) => {
        setUpdateForm((current) => ({ ...current, [field]: field === "difficulty" ? clampDifficulty(value) : value }));
    };

    const handleUpdateProblem = async () => {
        if (!selectedProblemId || !updateForm) return;

        setIsUpdating(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await updateAdminProblem(selectedProblemId, { ...updateForm, difficulty: clampDifficulty(updateForm.difficulty) });
            const detail = await getProblemDetail(selectedProblemId);
            setSelectedProblem(detail);
            setUpdateForm(toUpdateForm(detail));
            await loadCurrentPageProblems();
            setSuccessMessage("Problem updated.");
        } catch (error) {
            setErrorMessage(error.message || "Failed to update problem.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteProblem = async () => {
        if (!selectedProblemId) return;

        setIsDeleting(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await deleteAdminProblem(selectedProblemId);
            const nextProblems = await loadCurrentPageProblems();
            setSelectedProblemId(nextProblems[0]?.id ?? null);
            setSuccessMessage("Problem deleted.");
        } catch (error) {
            setErrorMessage(error.message || "Failed to delete problem.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReindexProblem = async () => {
        if (!selectedProblemId) return;

        setIsReindexing(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await reindexProblem(selectedProblemId);
            setSuccessMessage("Reindex requested.");
        } catch (error) {
            setErrorMessage(error.message || "Failed to request reindex.");
        } finally {
            setIsReindexing(false);
        }
    };

    if (!user) return <div></div>;

    return (
        <div className="admin-problem-page">
            <PageHeader
                title="Question Management"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div className="admin-problem-toolbar">
                <div className="admin-problem-filters">
                    {readingTypeOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={readingType === option.value ? "active" : ""}
                            onClick={() => setReadingType(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {errorMessage ? <p className="admin-problem-error">{errorMessage}</p> : null}
            {successMessage ? <p className="auth-success-message">{successMessage}</p> : null}

            <div className="admin-question-grid">
                <Card className="admin-question-form-card" title="Create Problem" subtitle="POST /api/admin/cms/problems">
                    <div className="admin-question-form">
                        <div className="admin-question-form-row">
                            <label className="common-input-group">
                                <span className="common-input-label">Reading Type</span>
                                <select className="admin-question-select" value={createForm.readingType} onChange={(event) => handleCreateFieldChange("readingType", event.target.value)}>
                                    {readingTypeOptions.filter((option) => option.value !== "ALL").map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </label>
                            <label className="common-input-group">
                                <span className="common-input-label">Problem Type</span>
                                <select className="admin-question-select" value={createForm.problemType} onChange={(event) => handleCreateFieldChange("problemType", event.target.value)}>
                                    {problemTypeOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </label>
                            <Input label="Difficulty" type="number" name="difficulty" value={createForm.difficulty} onChange={(event) => handleCreateFieldChange("difficulty", event.target.value)} />
                        </div>

                        <Input label="Passage" name="passageText" value={createForm.passageText} onChange={(event) => handleCreateFieldChange("passageText", event.target.value)} multiline rows={6} />
                        <Input label="Question" name="questionText" value={createForm.questionText} onChange={(event) => handleCreateFieldChange("questionText", event.target.value)} multiline rows={4} />
                        <Input label="Model Answer" name="modelAnswer" value={createForm.modelAnswer} onChange={(event) => handleCreateFieldChange("modelAnswer", event.target.value)} multiline rows={4} />

                        <div className="admin-question-keyword-section">
                            <div className="admin-question-keyword-header">
                                <div>
                                    <h3>Keywords</h3>
                                    <p>Max 10 keywords, weight 1-100.</p>
                                </div>
                                <Button variant="outline" size="small" onClick={handleAddCreateKeyword}>
                                    <Plus size={16} strokeWidth={2} />
                                    Add
                                </Button>
                            </div>

                            {createForm.keywords.map((item, index) => (
                                <div className="admin-tag-edit-row" key={`create-keyword-${index}`}>
                                    <input value={item.keyword} onChange={(event) => handleCreateKeywordChange(index, "keyword", event.target.value)} placeholder="Keyword" />
                                    <input type="number" min="1" max="100" value={item.weight} onChange={(event) => handleCreateKeywordChange(index, "weight", event.target.value)} placeholder="Weight" />
                                    <button type="button" onClick={() => handleRemoveCreateKeyword(index)}>
                                        <Trash2 size={16} strokeWidth={2} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="admin-problem-action-row">
                            <Button variant="primary" size="medium" onClick={handleCreateProblem} disabled={isCreating}>
                                <Save size={16} strokeWidth={2} />
                                {isCreating ? "Saving..." : "Create"}
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="admin-question-ai-card" title="Generate Problem" subtitle="POST /api/admin/cms/problems/generate">
                    <div className="admin-question-form">
                        <label className="common-input-group">
                            <span className="common-input-label">Reading Type</span>
                            <select className="admin-question-select" value={generateForm.readingType} onChange={(event) => handleGenerateFieldChange("readingType", event.target.value)}>
                                {readingTypeOptions.filter((option) => option.value !== "ALL").map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                        <Input label="Difficulty" type="number" name="difficulty" value={generateForm.difficulty} onChange={(event) => handleGenerateFieldChange("difficulty", event.target.value)} />
                        <Input label="Topic" name="topic" value={generateForm.topic} onChange={(event) => handleGenerateFieldChange("topic", event.target.value)} />
                        <div className="admin-problem-action-row">
                            <Button variant="outline" size="medium" onClick={handleGenerateProblem} disabled={isGenerating}>
                                <Bot size={16} strokeWidth={2} />
                                {isGenerating ? "Generating..." : "Generate"}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="admin-problem-layout">
                <Card className="admin-problem-list-card" title="Problem List" subtitle="GET /api/admin/cms/problems">
                    <div className="admin-problem-list-head">
                        <span>ID</span><span>Question</span><span>Type</span><span>Level</span><span>Reading</span>
                    </div>
                    {loading ? <p className="admin-problem-empty">Loading problems...</p> : filteredProblems.length === 0 ? <p className="admin-problem-empty">No problems found.</p> : (
                        <div className="admin-problem-list-body">
                            {filteredProblems.map((problem) => (
                                <button key={problem.id} type="button" className={`admin-problem-row ${selectedProblemId === problem.id ? "active" : ""}`} onClick={() => setSelectedProblemId(problem.id)}>
                                    <span>{problem.id}</span><span>{problem.questionText}</span><span>{problem.problemType}</span><span>{problem.difficulty}</span><span>{problem.readingType}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="admin-problem-pagination">
                        <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Prev</button>
                        <span>Page {page + 1}</span>
                        <button type="button" disabled={problems.length < 20} onClick={() => setPage((current) => current + 1)}>Next</button>
                    </div>
                </Card>

                <Card className="admin-problem-detail-card" title="Problem Detail" subtitle="PATCH /api/admin/cms/problems/{problemId}">
                    {detailLoading ? <p className="admin-problem-empty">Loading detail...</p> : !selectedProblem || !updateForm ? <p className="admin-problem-empty">Select a problem to inspect.</p> : (
                        <div className="admin-problem-detail">
                            <div className="admin-problem-meta-grid">
                                <div><span>Problem ID</span><strong>{selectedProblem.id}</strong></div>
                                <div><span>Created At</span><strong>{formatDate(selectedProblem.createdAt)}</strong></div>
                                <div><span>Reading Type</span><strong>{selectedProblem.readingType}</strong></div>
                                <div><span>Vector Index</span><strong>{selectedProblem.vectorIndexStatus || "-"}</strong></div>
                            </div>
                            <Input label="Passage" name="passageText" value={updateForm.passageText} onChange={(event) => handleUpdateFieldChange("passageText", event.target.value)} multiline rows={6} />
                            <Input label="Question" name="questionText" value={updateForm.questionText} onChange={(event) => handleUpdateFieldChange("questionText", event.target.value)} multiline rows={4} />
                            <div className="admin-question-form-row">
                                <label className="common-input-group">
                                    <span className="common-input-label">Reading Type</span>
                                    <select className="admin-question-select" value={updateForm.readingType} onChange={(event) => handleUpdateFieldChange("readingType", event.target.value)}>
                                        {readingTypeOptions.filter((option) => option.value !== "ALL").map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </label>
                                <Input label="Difficulty" type="number" name="difficulty" value={updateForm.difficulty} onChange={(event) => handleUpdateFieldChange("difficulty", event.target.value)} />
                            </div>
                            <Input label="Model Answer" name="modelAnswer" value={updateForm.modelAnswer} onChange={(event) => handleUpdateFieldChange("modelAnswer", event.target.value)} multiline rows={4} />
                            <div className="admin-problem-section">
                                <h3>Keywords</h3>
                                {(selectedProblem.keywords || []).length === 0 ? <p>No keywords registered.</p> : (
                                    <div className="admin-problem-keyword-list">
                                        {normalizeKeywords(selectedProblem.keywords).map((item) => (
                                            <div className="admin-problem-keyword" key={`${item.keyword}-${item.weight}`}>
                                                <strong>{item.keyword}</strong>
                                                <span>Weight {item.weight}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="admin-problem-action-row">
                                <Button variant="outline" size="medium" onClick={handleReindexProblem} disabled={isReindexing}><RefreshCw size={16} strokeWidth={2} />{isReindexing ? "Requesting..." : "Reindex"}</Button>
                                <Button variant="outline" size="medium" onClick={handleDeleteProblem} disabled={isDeleting}><Trash2 size={16} strokeWidth={2} />{isDeleting ? "Deleting..." : "Delete"}</Button>
                                <Button variant="primary" size="medium" onClick={handleUpdateProblem} disabled={isUpdating}><Save size={16} strokeWidth={2} />{isUpdating ? "Saving..." : "Update"}</Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default AdminQuestionManagement;
