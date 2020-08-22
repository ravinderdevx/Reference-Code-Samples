import axios from "axios";

import { getApiUrl, source } from "../config/api.config";
import { errorMessages } from "../config/messages.config";
import { localStorageService } from "./localstorage.service";

// declare a request interceptor
axios.interceptors.request.use(
  request => {
    if (request.method.toUpperCase() === "POST") {
      request.headers["Content-Type"] = "application/json";
    }
    request.headers.source = source;
    const isLoggedIn = localStorageService.isAuthenticated();
    const token = localStorageService.getAuthorizationToken();
    if (isLoggedIn || token) {
      const token = localStorageService.getAuthorizationToken();
      request.headers.Authorization = `Basic ${token}`;
    }
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

// declare a response interceptor
axios.interceptors.response.use(
  response => {
    // do something with the response data
    return Promise.resolve(response.data);
  },
  error => {
    // handle the response error
    const { response } = error;

    if (response) {
      const { status, data } = response;
      // place your reentry code
      if (status === 401) {
        return Promise.reject(data.Message);
      } else {
        return Promise.reject(data.Message);
      }
    } else {
      if (error.message === "Network Error") {
        return Promise.reject(errorMessages.API_NOT_AVAILABLE);
      } else {
        return Promise.reject(error.message);
      }
    }
  }
);

/* api methods */

const login = (username, password) => {
  return axios
    .post(getApiUrl("LOGIN"), { username, password })
    .then(response => {
      if (response.Success) {
        localStorageService.storeAuthUser(response);
      }
      return response;
    });
};
/* stafflogin login api method*/
const stafflogin = stafftoken => {
  let base64 = require("base-64");
  let token = base64.decode(stafftoken);
  localStorageService.storeAuthToken(token);
  return axios
    .post(getApiUrl("GETSTAFFLOGIN"), {
      token
    })
    .then(response => {
      if (response.Success) {
        localStorageService.storeAuthUser(response);
      }
      return response;
    });
};

const logout = () => {
  localStorageService.clearLocalStorage();
};

const get = endpoint => {
  return axios.get(getApiUrl(endpoint));
};

const post = (endpoint, data) => {
  return axios.post(getApiUrl(endpoint), data);
};

const postAsync = async (endpoint, data) => {
  return await axios.post(getApiUrl(endpoint), data);
};

const postFile = (endpoint, formData) => {
  return axios.post(getApiUrl(endpoint), formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// postDateRangeFilter
const postDateRange = data => {
  localStorageService.postDateRange(data);
};
//getDateRangeFilter
const getDateRange = () => {
  return JSON.parse(localStorageService.getDateRange());
};
export const apiService = {
  get,
  post,
  postAsync,
  login,
  logout,
  postFile,
  stafflogin,
  postDateRange,
  getDateRange
};
