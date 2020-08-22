import { ALERT_SUCCSS, ALERT_DANGER, ALERT_CLEAR} from '../../action-types';
import { SET_ALERT_SUCCSS, SET_ALERT_DANGER, SET_ALERT_CLEAR } from '../../mutation-types';

export default {
    [ALERT_SUCCSS]({ commit }, message) {
        commit(SET_ALERT_SUCCSS, message);
    },
    [ALERT_DANGER]({ commit }, message) {
        commit(SET_ALERT_DANGER, message);
    },
    [ALERT_CLEAR]({ commit }, message) {
        commit(SET_ALERT_CLEAR, message);
    }
};