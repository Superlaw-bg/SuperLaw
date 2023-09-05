import { error } from 'console';
import ApiBaseUrl from '../constants/env';
import store from '../store/store';
import toastService from './toastService';

const get = (url: string) => makeRequest(url, 'GET', false);

const post = (url: string, body: any) => {
    return makeRequest(url, 'POST', false, body);
};

const postFile = (url: string, body: any) => {
    return makeRequest(url, 'POST', true, body);
};

const put = (url: string, body: any) => {
    return makeRequest(url, 'PUT', false, body);
};

const del = (url: string, body: any) => {
    return makeRequest(url, 'DELETE', false, body);
};

const makeRequest = (url: string, method: string, hasFormData: boolean, body: any = null) => {
    const apiUrl: string = ApiBaseUrl + url;

    let request: any = {
        method,
    };

    const token = store.getState().auth.user.token;

    if (hasFormData) {
        if (token) {
            request.headers = {
                'Authorization': `Bearer ${token}`
            };
        }

        request.body = body;
        return fetch(apiUrl, request).then(responseHandler);
    }

    request.headers = {
        'Content-Type': 'application/json',
    };

    if (body) {
        request.body = JSON.stringify(body);
    }

    if (token) {
        request.headers = {
            ...request.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    return fetch(apiUrl, request)
    .then(responseHandler);
};

const responseHandler = async (res: any) => {
    if (!res.ok) {
        if (res.status === 401) {
            toastService.showError("Трябва да се влезете в акаунта си отново");
        }

        if (res.status === 400){
            const error = await res.json();
            
            toastService.showError(error.Message || error.message);
            return {
                isError: true,
                msg: error.Message || error.message
            }
        }

        if (res.status === 500){
            const msg = await res.text();
            toastService.showError(msg);
            return {
                isError: true,
                msg: msg
            }
        }
        return;
    }

    const contentType = res.headers.get("content-type");
    let response;
    if (contentType && contentType.indexOf("application/json") !== -1) {
        response = await res.json();

    } else if (contentType && contentType.indexOf("text") !== -1) {
        response = await res.text();

    } else {
        response = await res;
    }

    return response;
};

const requester = {
    get,
    post,
    postFile,
    put,
    del
};

export default requester;