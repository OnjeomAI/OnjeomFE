import { useEffect, useMemo, useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    ListOrdered,
    Save,
    Search,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";
import {
    getCurriculumItems,
    getUserCurricula,
    searchCurriculumUsers,
    updateCurriculumOrder,
} from "../../api/adminApi";

function normalizeList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.items)) return data.items;
    return [];
}

function formatDate(value) {
    if (!value) return "-";
    return value.replace("T", " ").slice(0, 16);
}

function getStatusLabel(status) {
    const labels = {
        ACTIVE: "진행 중",
        PAUSED: "중지됨",
        COMPLETED: "완료",
        PENDING: "대기",
        IN_PROGRESS: "진행",
        SKIPPED: "건너뜀",
    };

    return labels[status] || status || "-";
}

function AdminCurriculum() {
    const [user, setUser] = useState(null);
    const [userQuery, setUserQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [curricula, setCurricula] = useState([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState(null);
    const [curriculumItems, setCurriculumItems] = useState([]);
    const [orderedProblemIds, setOrderedProblemIds] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingCurricula, setIsLoadingCurricula] = useState(false);
    const [isLoadingItems, setIsLoadingItems] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        getUserByType("admin").then(setUser);
    }, []);

    useEffect(() => {
        let ignore = false;

        async function loadUsers() {
            setIsLoadingUsers(true);
            setErrorMessage("");

            try {
                const result = await searchCurriculumUsers(userQuery, 20);
                if (ignore) return;

                const nextUsers = normalizeList(result.data);
                setUsers(nextUsers);
                setSelectedUser((current) => {
                    if (current && nextUsers.some((item) => item.id === current.id)) {
                        return current;
                    }

                    return nextUsers[0] || null;
                });
            } catch (error) {
                if (!ignore) {
                    setUsers([]);
                    setSelectedUser(null);
                    setErrorMessage(error.message || "사용자 목록을 불러오지 못했습니다.");
                }
            } finally {
                if (!ignore) setIsLoadingUsers(false);
            }
        }

        const timeoutId = window.setTimeout(loadUsers, 250);

        return () => {
            ignore = true;
            window.clearTimeout(timeoutId);
        };
    }, [userQuery]);

    useEffect(() => {
        let ignore = false;

        async function loadCurricula() {
            if (!selectedUser) {
                setCurricula([]);
                setSelectedCurriculum(null);
                return;
            }

            setIsLoadingCurricula(true);
            setErrorMessage("");

            try {
                const result = await getUserCurricula(selectedUser.id);
                if (ignore) return;

                const nextCurricula = normalizeList(result.data);
                setCurricula(nextCurricula);
                setSelectedCurriculum((current) => {
                    if (
                        current &&
                        nextCurricula.some(
                            (item) => item.curriculumId === current.curriculumId
                        )
                    ) {
                        return current;
                    }

                    return nextCurricula[0] || null;
                });
            } catch (error) {
                if (!ignore) {
                    setCurricula([]);
                    setSelectedCurriculum(null);
                    setErrorMessage(error.message || "커리큘럼 이력을 불러오지 못했습니다.");
                }
            } finally {
                if (!ignore) setIsLoadingCurricula(false);
            }
        }

        loadCurricula();
        return () => {
            ignore = true;
        };
    }, [selectedUser]);

    useEffect(() => {
        let ignore = false;

        async function loadItems() {
            if (!selectedCurriculum) {
                setCurriculumItems([]);
                setOrderedProblemIds([]);
                return;
            }

            setIsLoadingItems(true);
            setErrorMessage("");

            try {
                const result = await getCurriculumItems(
                    selectedCurriculum.curriculumId
                );
                if (ignore) return;

                const nextItems = normalizeList(result.data);
                setCurriculumItems(nextItems);
                setOrderedProblemIds(nextItems.map((item) => item.problemId));
            } catch (error) {
                if (!ignore) {
                    setCurriculumItems([]);
                    setOrderedProblemIds([]);
                    setErrorMessage(error.message || "커리큘럼 문제를 불러오지 못했습니다.");
                }
            } finally {
                if (!ignore) setIsLoadingItems(false);
            }
        }

        loadItems();
        return () => {
            ignore = true;
        };
    }, [selectedCurriculum]);

    const orderedItems = useMemo(() => {
        const itemByProblemId = new Map(
            curriculumItems.map((item) => [item.problemId, item])
        );

        return orderedProblemIds
            .map((problemId) => itemByProblemId.get(problemId))
            .filter(Boolean);
    }, [curriculumItems, orderedProblemIds]);

    const moveItem = (problemId, direction) => {
        setSuccessMessage("");
        setOrderedProblemIds((current) => {
            const index = current.indexOf(problemId);
            if (index < 0) return current;

            const targetIndex = direction === "up" ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= current.length) return current;

            const next = [...current];
            [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
            return next;
        });
    };

    const handleSave = async () => {
        if (!selectedCurriculum) {
            setErrorMessage("순서를 저장할 커리큘럼을 선택해 주세요.");
            return;
        }

        if (orderedProblemIds.length === 0) {
            setErrorMessage("커리큘럼에 포함된 문제가 없습니다.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const result = await updateCurriculumOrder(
                selectedCurriculum.curriculumId,
                orderedProblemIds
            );
            const nextItems = normalizeList(result.data);
            if (nextItems.length > 0) {
                setCurriculumItems(nextItems);
                setOrderedProblemIds(nextItems.map((item) => item.problemId));
            }
            setSuccessMessage("커리큘럼 순서를 저장했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "커리큘럼 순서 저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    if (errorMessage && !user) return <div>{errorMessage}</div>;
    if (!user) return <div>관리자 정보를 불러오는 중입니다.</div>;

    return (
        <div className="admin-problem-page">
            <PageHeader
                title="커리큘럼"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            {errorMessage ? <p className="admin-problem-error">{errorMessage}</p> : null}
            {successMessage ? <p className="auth-success-message">{successMessage}</p> : null}

            <div className="admin-curriculum-history-layout">
                <Card className="admin-curriculum-user-card" title="사용자 선택">
                    <label className="admin-curriculum-search">
                        <Search size={16} />
                        <input
                            value={userQuery}
                            onChange={(event) => setUserQuery(event.target.value)}
                            placeholder="이메일 또는 닉네임 검색"
                        />
                    </label>

                    {isLoadingUsers ? (
                        <p className="admin-problem-empty">사용자를 불러오는 중입니다.</p>
                    ) : users.length === 0 ? (
                        <p className="admin-problem-empty">검색된 사용자가 없습니다.</p>
                    ) : (
                        <div className="admin-curriculum-user-list">
                            {users.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={
                                        selectedUser?.id === item.id ? "active" : ""
                                    }
                                    onClick={() => {
                                        setSuccessMessage("");
                                        setSelectedUser(item);
                                    }}
                                >
                                    <strong>{item.nickname || item.email}</strong>
                                    <span>{item.email}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="admin-curriculum-list-card" title="커리큘럼 이력">
                    {isLoadingCurricula ? (
                        <p className="admin-problem-empty">커리큘럼 이력을 불러오는 중입니다.</p>
                    ) : curricula.length === 0 ? (
                        <p className="admin-problem-empty">선택한 사용자의 커리큘럼이 없습니다.</p>
                    ) : (
                        <div className="admin-curriculum-history-list">
                            {curricula.map((curriculum) => (
                                <button
                                    key={curriculum.curriculumId}
                                    type="button"
                                    className={
                                        selectedCurriculum?.curriculumId ===
                                        curriculum.curriculumId
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() => {
                                        setSuccessMessage("");
                                        setSelectedCurriculum(curriculum);
                                    }}
                                >
                                    <div>
                                        <strong>
                                            커리큘럼 #{curriculum.curriculumId}
                                        </strong>
                                        <span>
                                            진단 #{curriculum.diagnosticId} / 생성{" "}
                                            {formatDate(curriculum.createdAt)}
                                        </span>
                                    </div>
                                    <em className={`status-${curriculum.status}`}>
                                        {getStatusLabel(curriculum.status)}
                                    </em>
                                    <p>
                                        Stage {curriculum.currentStage} / 완료{" "}
                                        {curriculum.completedItems} / 전체{" "}
                                        {curriculum.totalItems} / Theta{" "}
                                        {Number(curriculum.theta || 0).toFixed(2)}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            <Card className="admin-curriculum-order-card" title="순서 편집">
                <div className="admin-curriculum-order-toolbar">
                    <div>
                        <span>선택 커리큘럼</span>
                        <strong>
                            {selectedCurriculum
                                ? `#${selectedCurriculum.curriculumId}`
                                : "커리큘럼을 선택해 주세요"}
                        </strong>
                    </div>
                    <Button
                        variant="primary"
                        size="medium"
                        className="admin-inline-button"
                        onClick={handleSave}
                        disabled={isSaving || !selectedCurriculum}
                    >
                        <Save size={16} strokeWidth={2} />
                        {isSaving ? "저장 중..." : "순서 저장"}
                    </Button>
                </div>

                {isLoadingItems ? (
                    <p className="admin-problem-empty">커리큘럼 문제를 불러오는 중입니다.</p>
                ) : orderedItems.length === 0 ? (
                    <p className="admin-problem-empty">편집할 커리큘럼 문제를 선택해 주세요.</p>
                ) : (
                    <div className="admin-curriculum-order-list">
                        {orderedItems.map((item, index) => (
                            <div className="admin-curriculum-order-item" key={item.itemId}>
                                <div className="admin-curriculum-order-main">
                                    <span className="admin-curriculum-order-badge">
                                        <ListOrdered size={14} strokeWidth={2} />
                                        {index + 1}
                                    </span>
                                    <div>
                                        <strong>{item.questionText}</strong>
                                        <p>
                                            문제 ID {item.problemId} / Stage {item.stage} /
                                            난이도 {item.difficulty} /{" "}
                                            {getStatusLabel(item.status)}
                                        </p>
                                    </div>
                                </div>

                                <div className="admin-curriculum-order-actions">
                                    {item.status === "COMPLETED" ? (
                                        <span className="admin-curriculum-completed-badge">
                                            <CheckCircle2 size={14} />
                                            완료
                                        </span>
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => moveItem(item.problemId, "up")}
                                        disabled={index === 0}
                                        aria-label="위로 이동"
                                    >
                                        <ArrowUp size={16} strokeWidth={2} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveItem(item.problemId, "down")}
                                        disabled={index === orderedItems.length - 1}
                                        aria-label="아래로 이동"
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
    );
}

export default AdminCurriculum;
