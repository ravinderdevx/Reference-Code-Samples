import * as types from "../types";

export const showAlert = (data) => {
    return { type: types.SHOW_ALERT, payload: data };
};

export const hideAlert = () => {
    return { type: types.HIDE_ALERT, payload: {} }
};