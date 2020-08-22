import axios from 'axios';
import { LocalStorageService } from "../localstorage.service";
import { errorMessages } from "../../config/messages.config";

import { apiBaseUrl } from '@/environment/environment';


const config = {
  baseURL: apiBaseUrl
};

const httpClient = axios.create(config);

// Declare a request interceptor
httpClient.interceptors.request.use(
  request => {
    if (request.method.toUpperCase() == "POST") {
      request.headers["Content-Type"] = "application/json";
    }

    // request.headers.source = source;
    const isLoggedIn = LocalStorageService.isAuthenticated();
    if (isLoggedIn) {
      const token = LocalStorageService.getAuthorizationToken();
      request.headers.Authorization = `Basic ${token}`;
    }

    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

// declare a response interceptor
httpClient.interceptors.response.use(
  response => {
    // do something with the response data
    return Promise.resolve(response.data);
  },
  error => {
    // handle the response error
    const { response } = error;
    if (response) {
      const { status, data } = response;
      let error;
      if(data.Message) {
        error = data.Message;
      } else if(data.errors) {
        for(let key in  data.errors) {
          error = data.errors[key][0];
          break;
        }
      } else {
        error = errorMessages.UNKNOWN_ERROR;
      }

      // place your reentry code
      if (status === 401) {
        return Promise.reject(error);
      } else {
        return Promise.reject(error);
      }
    } else {
      if (error.message == "Network Error") {
        return Promise.reject(errorMessages.API_NOT_AVAILABLE);
      } else {
        return Promise.reject(error.Message);
      }
    }
  }
);


export default httpClient;
