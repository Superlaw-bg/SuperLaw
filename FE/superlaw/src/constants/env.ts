const getApiBaseUrl = () => {
    let url;

    if (process.env.NODE_ENV === 'development') {
        url = 'https://localhost:44350/api/';
    }

    return url;
};

const ApiBaseUrl = getApiBaseUrl();

export default ApiBaseUrl;