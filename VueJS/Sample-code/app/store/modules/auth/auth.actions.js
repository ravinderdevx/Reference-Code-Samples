import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/localstorage.service';

import { LOGIN, LOGOUT,REGISTER, RESETPASSWORD,CHANGEPASSWORD,FORGOTPASSWORD,VERIFYEMAIL,VALIDATETOKEN} from '../../action-types';
import { SET_AUTH, PURGE_AUTH, SET_ALERT_DANGER, SET_ALERT_SUCCSS } from '../../mutation-types';

export default {
    [LOGIN](context, credentials) {
        return new Promise(resolve => {
            AuthService.login(credentials)
                .then((user) => {
                    context.commit(SET_AUTH, user);
                    resolve(true);
                })
                .catch((message) => {
                    context.commit(SET_ALERT_DANGER, message);
                    resolve(false);
                });
        });
    },
    [LOGOUT](context) {
        LocalStorageService.logout();
        context.commit(PURGE_AUTH);
    },
    [REGISTER](context, userRequest) {
        return new Promise((resolve) => {
            AuthService.register(userRequest)
                .then((response) => {
                    context.commit(SET_ALERT_SUCCSS, response.Message);
                    resolve(true)
                })
                .catch(( message ) => {
                    context.commit(SET_ALERT_DANGER, message);
                    resolve(false);
                });
        });
    },
    [FORGOTPASSWORD](context, userRequest) {
        return new Promise((resolve) => {
            debugger;
            AuthService.forgotPassword(userRequest)
                .then(( response ) => {
                    debugger;
                    context.commit(SET_ALERT_SUCCSS, response.Message);
                    resolve(true);
                })
                .catch(( message ) => {
                    context.commit(SET_ALERT_DANGER, message);
                    resolve(false);
                });
        });
    },
    [RESETPASSWORD](context, modifyPasswordRequest) {
        return new Promise((resolve) => {
            AuthService.resetPassword(modifyPasswordRequest)
                .then(( response ) => {
                    context.commit(SET_ALERT_SUCCSS, response.Message);
                    resolve(true);
                })
                .catch(( message ) => {
                    context.commit(SET_ALERT_DANGER, message);
                    resolve(false);
                });
        });
    },
    [CHANGEPASSWORD](context, modifyPasswordRequest) {
        return new Promise((resolve) => {
            AuthService.changePassword(modifyPasswordRequest)
                .then(({ response }) => {
                    context.commit(SET_AUTH, response);
                    resolve(true);
                })
                .catch(( message ) => {
                    context.commit(SET_ALERT_DANGER, message);
                    resolve(false);
                });
        });
    },
    [VERIFYEMAIL](context, userRequest) {
        return new Promise((resolve) => {
            AuthService.verifyEmail(userRequest)
                .then(( response ) => {
                    context.commit(SET_ALERT_SUCCSS, response);
                    resolve(true);
                })
                .catch(( message ) => {
                    context.commit(SET_ALERT_DANGER, message);
                    resolve(false);
                });
        });
    },
    [VALIDATETOKEN](context, userRequest) {
        return new Promise((resolve) => {
            AuthService.validateToken(userRequest)
                .then(( response ) => {
                    context.commit(SET_ALERT_SUCCSS, response.Message);
                    resolve(true);
                })
                .catch(( message ) => {
                    context.commit(SET_ALERT_DANGER, message);
                    resolve(false);
                });
        });
    },
}