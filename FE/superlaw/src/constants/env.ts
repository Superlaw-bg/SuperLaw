const getApiBaseUrl = () => {
    let url;

    if (process.env.NODE_ENV === 'development') {
        url = 'https://localhost:44350/api/';
    } else {
        url = 'https://superlawapi.azurewebsites.net/api/';
    }

    return url;
};

const ApiBaseUrl = getApiBaseUrl();

export default ApiBaseUrl;