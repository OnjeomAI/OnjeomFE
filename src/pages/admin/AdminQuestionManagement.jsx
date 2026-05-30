import { useEffect, useState } from "react";

import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";
import {
    getProblemDetail,
    getProblems,
} from "../../data/services/problemService";

const readingTypeOptions = [
    { label: "전체", value: "ALL" },
    { label: "사실형", value: "FACTUAL" },
    { label: "추론형", value: "INFERENTIAL" },
    { label: "비판형", value: "CRITICAL" },
    { label: "창의형", value: "CREATIVE" },
];

function formatDate(value) {
    if (!value) {
        return "-";
    }

    return value.replace("T", " ").slice(0, 16);
}

function renderKeywords(keywords = []) {
    if (!keywords.length) {
        return <p className="admin-problem-empty">키워드 정보가 없습니다.</p>;
    }

    return (
        <div className="admin-problem-keyword-list">
            {keywords.map((item) => (
                <div className="admin-problem-keyword" key={item.keyword}>
                    <strong>{item.keyword}</strong>
                    <span>{item.weight}</span>
                </div>
            ))}
        </div>
    );
}

function AdminQuestionManagement() {
    const [user, setUser] = useState(null);
    const [readingType, setReadingType] = useState("ALL");
    const [page, setPage] = useState(0);
    const [problems, setProblems] = useState([]);
    const [selectedProblemId, setSelectedProblemId] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        getUserByType("admin").then(setUser);
    }, []);

    useEffect(() => {
        let ignore = false;

        async function loadProblems() {
            setLoading(true);
            setErrorMessage("");

            try {
                const nextProblems = await getProblems({
                    page,
                    size: 20,
                    readingType,
                });

                if (ignore) {
                    return;
                }

                setProblems(nextProblems);
                setSelectedProblemId(nextProblems[0]?.id ?? null);
            } catch (error) {
                if (ignore) {
                    return;
                }

                setProblems([]);
                setSelectedProblemId(null);
                setSelectedProblem(null);
                setErrorMessage(
                    error.message || "문제 목록을 불러오지 못했습니다."
                );
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadProblems();

        return () => {
            ignore = true;
        };
    }, [page, readingType]);

    useEffect(() => {
        let ignore = false;

        async function loadDetail() {
            if (!selectedProblemId) {
                setSelectedProblem(null);
                return;
            }

            setDetailLoading(true);

            try {
                const detail = await getProblemDetail(selectedProblemId);

                if (ignore) {
                    return;
                }

                setSelectedProblem(detail);
            } catch (error) {
                if (!ignore) {
                    setSelectedProblem(null);
                    setErrorMessage(
                        error.message || "문제 상세를 불러오지 못했습니다."
                    );
                }
            } finally {
                if (!ignore) {
                    setDetailLoading(false);
                }
            }
        }

        loadDetail();

        return () => {
            ignore = true;
        };
    }, [selectedProblemId]);

    if (!user) {
        return <div></div>;
    }

    return (
        <div className="admin-problem-page">
            <PageHeader
                title="문항 관리"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div className="admin-problem-toolbar">
                <div>
                    <h2>문제 목록 조회</h2>
                    <p>독서 유형별 필터와 상세 조회를 한 화면에서 확인합니다.</p>
                </div>

                <div className="admin-problem-filters">
                    {readingTypeOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={
                                readingType === option.value ? "active" : ""
                            }
                            onClick={() => {
                                setReadingType(option.value);
                                setPage(0);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {errorMessage && (
                <p className="admin-problem-error">{errorMessage}</p>
            )}

            <div className="admin-problem-layout">
                <Card
                    className="admin-problem-list-card"
                    title="문제 목록"
                    subtitle="GET /api/problems 또는 GET /api/problems/type/{readingType}"
                >
                    {loading ? (
                        <p className="admin-problem-empty">
                            문제 목록을 불러오는 중입니다.
                        </p>
                    ) : problems.length === 0 ? (
                        <p className="admin-problem-empty">
                            조회된 문제가 없습니다.
                        </p>
                    ) : (
                        <>
                            <div className="admin-problem-list-head">
                                <span>ID</span>
                                <span>문항</span>
                                <span>유형</span>
                                <span>난이도</span>
                                <span>벡터 상태</span>
                            </div>

                            <div className="admin-problem-list-body">
                                {problems.map((problem) => (
                                    <button
                                        key={problem.id}
                                        type="button"
                                        className={`admin-problem-row ${
                                            selectedProblemId === problem.id
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedProblemId(problem.id)
                                        }
                                    >
                                        <span>{problem.id}</span>
                                        <span>{problem.questionText}</span>
                                        <span>{problem.readingType}</span>
                                        <span>{problem.difficulty}</span>
                                        <span>{problem.vectorIndexStatus}</span>
                                    </button>
                                ))}
                            </div>

                            {readingType === "ALL" && (
                                <div className="admin-problem-pagination">
                                    <button
                                        type="button"
                                        disabled={page === 0}
                                        onClick={() =>
                                            setPage((currentPage) =>
                                                Math.max(0, currentPage - 1)
                                            )
                                        }
                                    >
                                        이전
                                    </button>
                                    <span>{page + 1} 페이지</span>
                                    <button
                                        type="button"
                                        disabled={problems.length < 20}
                                        onClick={() =>
                                            setPage((currentPage) =>
                                                currentPage + 1
                                            )
                                        }
                                    >
                                        다음
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </Card>

                <Card
                    className="admin-problem-detail-card"
                    title="문제 상세"
                    subtitle="GET /api/problems/{problemId}"
                >
                    {detailLoading ? (
                        <p className="admin-problem-empty">
                            문제 상세를 불러오는 중입니다.
                        </p>
                    ) : !selectedProblem ? (
                        <p className="admin-problem-empty">
                            문제를 선택하면 상세 정보가 표시됩니다.
                        </p>
                    ) : (
                        <div className="admin-problem-detail">
                            <div className="admin-problem-meta-grid">
                                <div>
                                    <span>ID</span>
                                    <strong>{selectedProblem.id}</strong>
                                </div>
                                <div>
                                    <span>문제 유형</span>
                                    <strong>{selectedProblem.problemType}</strong>
                                </div>
                                <div>
                                    <span>독서 유형</span>
                                    <strong>{selectedProblem.readingType}</strong>
                                </div>
                                <div>
                                    <span>난이도</span>
                                    <strong>{selectedProblem.difficulty}</strong>
                                </div>
                                <div>
                                    <span>벡터 인덱싱</span>
                                    <strong>
                                        {selectedProblem.vectorIndexed
                                            ? "완료"
                                            : "미완료"}
                                    </strong>
                                </div>
                                <div>
                                    <span>벡터 상태</span>
                                    <strong>
                                        {selectedProblem.vectorIndexStatus}
                                    </strong>
                                </div>
                                <div>
                                    <span>생성일</span>
                                    <strong>
                                        {formatDate(selectedProblem.createdAt)}
                                    </strong>
                                </div>
                            </div>

                            <div className="admin-problem-section">
                                <h3>질문</h3>
                                <p>{selectedProblem.questionText}</p>
                            </div>

                            <div className="admin-problem-section">
                                <h3>지문</h3>
                                <p>{selectedProblem.passageText}</p>
                            </div>

                            <div className="admin-problem-section">
                                <h3>모범 답안</h3>
                                <p>{selectedProblem.modelAnswer}</p>
                            </div>

                            <div className="admin-problem-section">
                                <h3>키워드</h3>
                                {renderKeywords(selectedProblem.keywords)}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default AdminQuestionManagement;
