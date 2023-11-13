import apiRoutes from "./apiRoutes";
import axios from "./Api";

const getCities = () => {
    return axios.get(apiRoutes.cities);
}

const cityApi = {
    getCities
};

export default cityApi;