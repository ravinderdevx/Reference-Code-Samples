
import httpClient from './http-client';

import { ApiUrls } from '../config/api.config';
import { LocalStorageService } from './localstorage.service';

const login = (credentials) => {
    debugger;

    return httpClient
        .post(ApiUrls.LOGIN, credentials)
        .then(response => {
            if (response.Status) {
                LocalStorageService.storeAuthToken(response.Data);
                LocalStorageService.storeAuthUser(response,credentials.rememberMe);
            }
            return response.Data;
        });
};

const register = (userRegisterRequest) => {
    return httpClient
        .post(ApiUrls.REGISTER, userRegisterRequest)
        .then(response => {
            return response;
        });
};

const forgotPassword = (userRequest) => {
    return httpClient
        .post(ApiUrls.FORGOTPASSWORD, userRequest)
        .then(response => {
            
            return response;
        });
};

const resetPassword = (modifyPasswordRequest) => {
    return httpClient
        .post(ApiUrls.RESETPASSWORD, modifyPasswordRequest)
        .then(response => {
           
            return response;
        });
};
const changePassword = (modifyPasswordRequest) => {
    return httpClient
        .post(ApiUrls.CHANGEPASSWORD, modifyPasswordRequest)
        .then(response => {
          
            return response;
        });
};

const verifyEmail = (verifyPasswordRequest) => {
    return httpClient
        .post(ApiUrls.VERIFYEMAIL, verifyPasswordRequest)
        .then(response => {
            
            return response;
        });
};
const validateToken = (validateTokenRequest) => {
    return httpClient
        .post(ApiUrls.VALIDATETOKEN, validateTokenRequest)
        .then(response => {
            
            return response;
        });
};
export const AuthService = {
    login,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    validateToken
}