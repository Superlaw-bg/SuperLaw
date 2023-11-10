import axios from "./Api";
import apiRoutes from '../api/apiRoutes';

const getCategories = () => {
    return axios.get(apiRoutes.legalCategories);
}

const categoryApi = {
    getCategories
};

export default categoryApi;