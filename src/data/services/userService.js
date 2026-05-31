import { getMyProfile as getMyProfileApi, updateMyProfile as updateMyProfileApi } from "../../api/userApi";
import { getAuthUser, setAuthUser } from "../../utils/authStorage";
import { normalizeUserProfile } from "../../utils/mappers";

export async function getMyProfile(type = "learner") {
    const result = await getMyProfileApi();
    const normalizedUser = normalizeUserProfile(result.data, type);

    setAuthUser({
        ...getAuthUser(),
        ...result.data,
        ...normalizedUser,
    });

    return normalizedUser;
}

export async function updateMyProfile(type = "learner", updatedFields = {}) {
    const payload = {
        nickname: updatedFields.nickname,
        dailyGoal: updatedFields.dailyGoal,
        alarmEnabled: updatedFields.alarmEnabled,
    };
    const result = await updateMyProfileApi(payload);
    const normalizedUser = normalizeUserProfile(result.data, type);

    setAuthUser({
        ...getAuthUser(),
        ...result.data,
        ...normalizedUser,
    });

    return normalizedUser;
}

