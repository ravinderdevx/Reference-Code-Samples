import { SET_ALERT_SUCCSS, SET_ALERT_DANGER, SET_ALERT_CLEAR } from "../../mutation-types";

export default {
    [SET_ALERT_SUCCSS](state, message) {
        state.type = 'alert-success';
        state.message = message;
    },
    [SET_ALERT_DANGER](state, message) {
        state.type = 'alert-danger';
        state.message = message;
    },
    [SET_ALERT_CLEAR](state) {
        state.type = null;
        state.message = null;
    }
};