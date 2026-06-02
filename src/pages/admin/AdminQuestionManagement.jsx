import { useEffect, useMemo, useState } from "react";
import {
    Bot,
    Check,
    FileText,
    ListChecks,
    Pencil,
    Plus,
    RefreshCw,
    Save,
    Sparkles,
    Trash2,
} from "lucide-react";
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
} from "../../data/services/adminService";

const readingTypeOptions = [
    { label: "전체", value: "ALL" },
    { label: "사실 이해", value: "FACTUAL" },
    { label: "추론 이해", value: "INFERENTIAL" },
    { label: "비판 이해", value: "CRITICAL" },
    { label: "창의 이해", value: "CREATIVE" },
    { label: "어휘 이해", value: "VOCABULARY" },
    { label: "논리 이해", value: "LOGICAL" },
];

const problemTypeOptions = [
    { label: "주관식", value: "SHORT_ANSWER" },
    { label: "객관식", value: "MULTIPLE_CHOICE" },
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
        keywords: [],
    };
}

function createGenerateForm() {
    return { topic: "" };
}

function normalizeAdminProblemList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.problems)) return data.problems;
    return [];
}

function normalizeKeywords(keywords = []) {
    return keywords.map((item) => ({
        keyword: item.keyword || "",
        weight: Number(item.weight) || 1,
    }));
}

function normalizeGeneratedProblemPayload(payload) {
    const source =
        payload?.data && typeof payload.data === "object" ? payload.data : payload;

    if (!source || typeof source !== "object") {
        return {};
    }

    return {
        passageText: source.passageText ?? source.passage ?? "",
        questionText: source.questionText ?? source.question ?? "",
        problemType: source.problemType,
        readingType: source.readingType,
        difficulty: source.difficulty,
        modelAnswer:
            source.modelAnswer ??
            source.answer ??
            source.explanation ??
            "",
        keywords: Array.isArray(source.keywords) ? source.keywords : [],
    };
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

function getPassageTextareaRows(value) {
    const lineCount = String(value || "").split(/\r\n|\r|\n/).length;

    return Math.min(10, Math.max(1, lineCount));
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

function getReadingTypeLabel(value) {
    return readingTypeOptions.find((option) => option.value === value)?.label || value;
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

    const keywordWeightTotal = useMemo(() => {
        return createForm.keywords.reduce(
            (total, item) => total + (Number(item.weight) || 0),
            0
        );
    }, [createForm.keywords]);

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
                    const hasCurrent = nextProblems.some(
                        (problem) => problem.id === currentId
                    );
                    return hasCurrent ? currentId : nextProblems[0]?.id ?? null;
                });
            } catch (error) {
                if (!ignore) {
                    setProblems([]);
                    setSelectedProblemId(null);
                    setSelectedProblem(null);
                    setUpdateForm(null);
                    setErrorMessage(error.message || "문제 목록을 불러오지 못했습니다.");
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
                    setErrorMessage(error.message || "문제 상세 정보를 불러오지 못했습니다.");
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
        setCreateForm((current) => ({
            ...current,
            [field]: field === "difficulty" ? clampDifficulty(value) : value,
        }));
    };

    const handleCreateKeywordChange = (index, field, value) => {
        setCreateForm((current) => ({
            ...current,
            keywords: current.keywords.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]:
                              field === "weight" ? clampKeywordWeight(value) : value,
                      }
                    : item
            ),
        }));
    };

    const handleAddCreateKeyword = () => {
        setCreateForm((current) => ({
            ...current,
            keywords:
                current.keywords.length >= 10
                    ? current.keywords
                    : [...current.keywords, createKeywordItem()],
        }));
    };

    const handleRemoveCreateKeyword = (index) => {
        setCreateForm((current) => ({
            ...current,
            keywords: current.keywords.filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const validateCreateForm = () => {
        if (!createForm.passageText.trim()) return "지문을 입력해 주세요.";
        if (!createForm.questionText.trim()) return "문항을 입력해 주세요.";
        if (!createForm.modelAnswer.trim()) return "모범 답안을 입력해 주세요.";
        if (createForm.keywords.length > 10) {
            return "키워드는 최대 10개까지 등록할 수 있습니다.";
        }

        const invalidKeyword = createForm.keywords.find(
            (item) =>
                item.keyword.trim() && (item.weight < 1 || item.weight > 100)
        );
        if (invalidKeyword) return "키워드 가중치는 1부터 100 사이여야 합니다.";
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
                    .map((item) => ({
                        keyword: item.keyword.trim(),
                        weight: clampKeywordWeight(item.weight),
                    }))
                    .filter((item) => item.keyword),
            });
            const nextProblems = await loadCurrentPageProblems();
            setCreateForm(createProblemForm());
            setSelectedProblemId(nextProblems[0]?.id ?? null);
            setSuccessMessage("문제를 등록했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "문제 등록에 실패했습니다.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleGenerateFieldChange = (field, value) => {
        setGenerateForm((current) => ({
            ...current,
            [field]: field === "difficulty" ? clampDifficulty(value) : value,
        }));
    };

    const handleGenerateProblem = async () => {
        setIsGenerating(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const requestedReadingType = createForm.readingType;
            const requestedDifficulty = clampDifficulty(createForm.difficulty);
            const result = await generateProblem({
                readingType: requestedReadingType,
                difficulty: requestedDifficulty,
                topic: generateForm.topic,
            });
            const detail = normalizeGeneratedProblemPayload(result);
            await loadCurrentPageProblems();

            setCreateForm((current) => ({
                ...current,
                passageText: detail.passageText ?? "",
                questionText: detail.questionText ?? "",
                problemType: detail.problemType || current.problemType,
                readingType: detail.readingType || requestedReadingType,
                difficulty: detail.difficulty || requestedDifficulty,
                modelAnswer: detail.modelAnswer ?? "",
                keywords:
                    detail.keywords.length > 0
                        ? normalizeKeywords(detail.keywords)
                        : [],
            }));

            setSuccessMessage("AI 생성 요청을 완료했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "문제 생성에 실패했습니다.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpdateFieldChange = (field, value) => {
        setUpdateForm((current) => ({
            ...current,
            [field]: field === "difficulty" ? clampDifficulty(value) : value,
        }));
    };

    const handleUpdateProblem = async () => {
        if (!selectedProblemId || !updateForm) return;

        setIsUpdating(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await updateAdminProblem(selectedProblemId, {
                ...updateForm,
                difficulty: clampDifficulty(updateForm.difficulty),
            });
            const detail = await getProblemDetail(selectedProblemId);
            setSelectedProblem(detail);
            setUpdateForm(toUpdateForm(detail));
            await loadCurrentPageProblems();
            setSuccessMessage("문제를 수정했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "문제 수정에 실패했습니다.");
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
            setSuccessMessage("문제를 삭제했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "문제 삭제에 실패했습니다.");
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
            setSuccessMessage("벡터 재색인을 요청했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "벡터 재색인 요청에 실패했습니다.");
        } finally {
            setIsReindexing(false);
        }
    };

    if (!user) return <div></div>;

    return (
        <div className="admin-problem-page admin-question-studio-page">
            <PageHeader
                title="문항 관리"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            {errorMessage ? (
                <p className="admin-problem-error">{errorMessage}</p>
            ) : null}
            {successMessage ? (
                <p className="auth-success-message">{successMessage}</p>
            ) : null}

            <div className="admin-question-studio">
                <section className="admin-question-direct-panel">
                    <div className="admin-question-editor-card">
                        <div className="admin-question-editor-toolbar">
                            <div>
                                <span>지문 본문 에디터</span>
                                <strong>직접 문항 제작</strong>
                            </div>
                            <div className="admin-question-tool-icons">
                                <button type="button" aria-label="굵게">B</button>
                                <button type="button" aria-label="기울임">I</button>
                                <button type="button" aria-label="밑줄">U</button>
                                <button type="button" aria-label="목록">
                                    <ListChecks size={15} />
                                </button>
                                <button type="button" aria-label="인용">99</button>
                                <button type="button" aria-label="편집">
                                    <Pencil size={15} />
                                </button>
                            </div>
                        </div>

                        <textarea
                            className="admin-question-passage-editor"
                            value={createForm.passageText}
                            onChange={(event) =>
                                handleCreateFieldChange("passageText", event.target.value)
                            }
                            placeholder="학습 지문 내용을 여기에 입력하세요..."
                        />
                    </div>

                    <div className="admin-question-prompt-card">
                        <label>
                            <span>발문</span>
                            <input
                                value={createForm.questionText}
                                onChange={(event) =>
                                    handleCreateFieldChange(
                                        "questionText",
                                        event.target.value
                                    )
                                }
                                placeholder="예: 위 글의 핵심 논지로 가장 적절한 것은?"
                            />
                        </label>

                        <label>
                            <span>모범 답안 및 해설</span>
                            <textarea
                                value={createForm.modelAnswer}
                                onChange={(event) =>
                                    handleCreateFieldChange(
                                        "modelAnswer",
                                        event.target.value
                                    )
                                }
                                placeholder="정답에 대한 상세한 분석 및 근거를 입력하세요..."
                            />
                        </label>
                    </div>
                </section>

                <aside className="admin-question-side-column">
                    <div className="admin-question-settings-card">
                        <div className="admin-question-card-title">
                            <FileText size={16} />
                            <span>문항 설정</span>
                        </div>

                        <div className="admin-question-setting-block">
                            <span>독해 영역 선택</span>
                            <div className="admin-question-reading-grid">
                                {readingTypeOptions
                                    .filter((option) => option.value !== "ALL")
                                    .map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={
                                                createForm.readingType === option.value
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleCreateFieldChange(
                                                    "readingType",
                                                    option.value
                                                )
                                            }
                                        >
                                            <span>
                                                {createForm.readingType === option.value ? (
                                                    <Check size={13} />
                                                ) : null}
                                            </span>
                                            {option.label}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <div className="admin-question-setting-block">
                            <span>문제 유형</span>
                            <div className="admin-question-segmented">
                                {problemTypeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={
                                            createForm.problemType === option.value
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            handleCreateFieldChange(
                                                "problemType",
                                                option.value
                                            )
                                        }
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="admin-question-setting-block">
                            <span>난이도 설정</span>
                            <div className="admin-question-stars">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={
                                            value <= createForm.difficulty ? "active" : ""
                                        }
                                        onClick={() =>
                                            handleCreateFieldChange("difficulty", value)
                                        }
                                        aria-label={`난이도 ${value}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="admin-question-setting-block">
                            <div className="admin-question-keyword-title">
                                <span>핵심어 가중치</span>
                                <strong>합계 {keywordWeightTotal}%</strong>
                            </div>
                            <div className="admin-question-keyword-editor">
                                {createForm.keywords.map((item, index) => (
                                    <div
                                        className="admin-question-keyword-row"
                                        key={`create-keyword-${index}`}
                                    >
                                        <input
                                            value={item.keyword}
                                            onChange={(event) =>
                                                handleCreateKeywordChange(
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
                                                handleCreateKeywordChange(
                                                    index,
                                                    "weight",
                                                    event.target.value
                                                )
                                            }
                                            aria-label="가중치"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCreateKeyword(index)}
                                            aria-label="키워드 삭제"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="admin-question-add-keyword"
                                    type="button"
                                    onClick={handleAddCreateKeyword}
                                >
                                    <Plus size={14} />
                                    키워드 추가
                                </button>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="large"
                            fullWidth
                            onClick={handleCreateProblem}
                            disabled={isCreating}
                        >
                            <Save size={17} />
                            {isCreating ? "저장 중..." : "아카이브 저장"}
                        </Button>
                    </div>

                    <div className="admin-question-ai-studio-card">
                        <div className="admin-question-card-title">
                            <Sparkles size={16} />
                            <span>AI 문항 생성</span>
                        </div>
                        <div className="admin-question-ai-form">
                            <label>
                                <span>생성 영역</span>
                                <select
                                    value={createForm.readingType}
                                    onChange={(event) =>
                                        handleCreateFieldChange(
                                            "readingType",
                                            event.target.value
                                        )
                                    }
                                >
                                    {readingTypeOptions
                                        .filter((option) => option.value !== "ALL")
                                        .map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                </select>
                            </label>
                            <label>
                                <span>난이도</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={createForm.difficulty}
                                    onChange={(event) =>
                                        handleCreateFieldChange(
                                            "difficulty",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>
                            <label>
                                <span>주제</span>
                                <input
                                    value={generateForm.topic}
                                    onChange={(event) =>
                                        handleGenerateFieldChange(
                                            "topic",
                                            event.target.value
                                        )
                                    }
                                    placeholder="예: 논리적 오류, 과학 기술 윤리"
                                />
                            </label>
                            <Button
                                variant="outline"
                                size="medium"
                                fullWidth
                                onClick={handleGenerateProblem}
                                disabled={isGenerating}
                            >
                                <Bot size={16} />
                                {isGenerating ? "생성 중..." : "AI로 생성"}
                            </Button>
                        </div>
                    </div>

                </aside>
            </div>

            <div className="admin-problem-layout">
                <Card className="admin-problem-list-card" title="문제 목록">
                    <div className="admin-problem-list-filter-row">
                        <span>독해 유형</span>
                        <div className="admin-problem-filters">
                            {readingTypeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={
                                        readingType === option.value ? "active" : ""
                                    }
                                    onClick={() => setReadingType(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="admin-problem-list-head">
                        <span>ID</span>
                        <span>유형</span>
                        <span>문항</span>
                        <span>난이도</span>
                        <span>독해</span>
                    </div>
                    {loading ? (
                        <p className="admin-problem-empty">
                            문제 목록을 불러오는 중입니다.
                        </p>
                    ) : filteredProblems.length === 0 ? (
                        <p className="admin-problem-empty">
                            등록된 문제가 없습니다.
                        </p>
                    ) : (
                        <div className="admin-problem-list-body">
                            {filteredProblems.map((problem) => (
                                <button
                                    key={problem.id}
                                    type="button"
                                    className={`admin-problem-row ${
                                        selectedProblemId === problem.id
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedProblemId(problem.id)}
                                >
                                    <span>{problem.id}</span>
                                    <span>{problem.problemType || "-"}</span>
                                    <span>{problem.questionText}</span>
                                    <span>{problem.difficulty}</span>
                                    <span>{getReadingTypeLabel(problem.readingType)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="admin-problem-pagination">
                        <button
                            type="button"
                            disabled={page === 0}
                            onClick={() =>
                                setPage((current) => Math.max(0, current - 1))
                            }
                        >
                            이전
                        </button>
                        <span>{page + 1}페이지</span>
                        <button
                            type="button"
                            disabled={problems.length < 20}
                            onClick={() => setPage((current) => current + 1)}
                        >
                            다음
                        </button>
                    </div>
                </Card>

                <Card className="admin-problem-detail-card" title="문제 상세">
                    {detailLoading ? (
                        <p className="admin-problem-empty">
                            상세 정보를 불러오는 중입니다.
                        </p>
                    ) : !selectedProblem || !updateForm ? (
                        <p className="admin-problem-empty">
                            확인할 문제를 선택해 주세요.
                        </p>
                    ) : (
                        <div className="admin-problem-detail">
                            <div className="admin-problem-meta-grid">
                                <div>
                                    <span>문제 ID</span>
                                    <strong>{selectedProblem.id}</strong>
                                </div>
                                <div>
                                    <span>등록일</span>
                                    <strong>{formatDate(selectedProblem.createdAt)}</strong>
                                </div>
                                <div>
                                    <span>독해 유형</span>
                                    <strong>
                                        {getReadingTypeLabel(selectedProblem.readingType)}
                                    </strong>
                                </div>
                                <div>
                                    <span>벡터 색인</span>
                                    <strong>
                                        {selectedProblem.vectorIndexStatus || "-"}
                                    </strong>
                                </div>
                            </div>
                            <Input
                                label="지문"
                                name="passageText"
                                value={updateForm.passageText}
                                onChange={(event) =>
                                    handleUpdateFieldChange(
                                        "passageText",
                                        event.target.value
                                    )
                                }
                                multiline
                                rows={getPassageTextareaRows(updateForm.passageText)}
                                className="admin-problem-passage-input"
                            />
                            <Input
                                label="문항"
                                name="questionText"
                                value={updateForm.questionText}
                                onChange={(event) =>
                                    handleUpdateFieldChange(
                                        "questionText",
                                        event.target.value
                                    )
                                }
                                multiline
                                rows={4}
                            />
                            <div className="admin-question-form-row">
                                <label className="common-input-group">
                                    <span className="common-input-label">
                                        독해 유형
                                    </span>
                                    <select
                                        className="admin-question-select"
                                        value={updateForm.readingType}
                                        onChange={(event) =>
                                            handleUpdateFieldChange(
                                                "readingType",
                                                event.target.value
                                            )
                                        }
                                    >
                                        {readingTypeOptions
                                            .filter((option) => option.value !== "ALL")
                                            .map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                    </select>
                                </label>
                                <Input
                                    label="난이도"
                                    type="number"
                                    name="difficulty"
                                    value={updateForm.difficulty}
                                    onChange={(event) =>
                                        handleUpdateFieldChange(
                                            "difficulty",
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                            <Input
                                label="모범 답안"
                                name="modelAnswer"
                                value={updateForm.modelAnswer}
                                onChange={(event) =>
                                    handleUpdateFieldChange(
                                        "modelAnswer",
                                        event.target.value
                                    )
                                }
                                multiline
                                rows={4}
                            />
                            <div className="admin-problem-section">
                                <h3>키워드</h3>
                                {(selectedProblem.keywords || []).length === 0 ? (
                                    <p>등록된 키워드가 없습니다.</p>
                                ) : (
                                    <div className="admin-problem-keyword-list">
                                        {normalizeKeywords(
                                            selectedProblem.keywords
                                        ).map((item) => (
                                            <div
                                                className="admin-problem-keyword"
                                                key={`${item.keyword}-${item.weight}`}
                                            >
                                                <strong>{item.keyword}</strong>
                                                <span>가중치 {item.weight}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="admin-problem-action-row">
                                <Button
                                    variant="outline"
                                    size="medium"
                                    onClick={handleReindexProblem}
                                    disabled={isReindexing}
                                >
                                    <RefreshCw size={16} strokeWidth={2} />
                                    {isReindexing ? "요청 중..." : "재색인"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="medium"
                                    onClick={handleDeleteProblem}
                                    disabled={isDeleting}
                                >
                                    <Trash2 size={16} strokeWidth={2} />
                                    {isDeleting ? "삭제 중..." : "삭제"}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="medium"
                                    onClick={handleUpdateProblem}
                                    disabled={isUpdating}
                                >
                                    <Save size={16} strokeWidth={2} />
                                    {isUpdating ? "저장 중..." : "수정"}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default AdminQuestionManagement;
