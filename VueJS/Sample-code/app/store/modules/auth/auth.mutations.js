import { SET_AUTH, PURGE_AUTH, SET_AUTH_ERROR } from "../../mutation-types";

export default {
    [SET_AUTH_ERROR](state, error) {
        state.error = error;
    },
    [SET_AUTH](state, user) {
        state.isAuthenticated = true;
        state.user = user;
        state.error = null;
    },
    [PURGE_AUTH](state) {
        state.isAuthenticated = false;
        state.user = {};
        state.error = null;
    }
};