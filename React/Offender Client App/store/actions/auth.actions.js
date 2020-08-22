import * as types from "../types";

export const loginSuccess = (data) => {
    return { type: types.LOGIN_SUCCESS, payload: data };
};

export const logout = () => {
    return { type: types.LOGOUT, payload: {} }
};
