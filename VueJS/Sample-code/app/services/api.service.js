import httpClient from './http-client';

const get = endpoint => {
    return httpClient.get(endpoint);
};

const post = (endpoint, data) => {
    return httpClient.post(endpoint, data);
};

export const ApiService = {
    get,
    post
}