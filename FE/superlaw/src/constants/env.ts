const getApiBaseUrl = () => {
    return process.env.REACT_APP_API_ENDPOINT;
};

const ApiBaseUrl = getApiBaseUrl();

export default ApiBaseUrl;