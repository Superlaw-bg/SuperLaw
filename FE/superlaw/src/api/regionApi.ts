import apiRoutes from "./apiRoutes";
import axios from "./Api";

const getRegions = () => {
    return axios.get(apiRoutes.judicialRegions);
}

const regionApi = {
    getRegions
};

export default regionApi;