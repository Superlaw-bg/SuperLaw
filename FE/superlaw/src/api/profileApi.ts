import axios from "./Api";
import { setAuthHeader } from "./Api";
import apiRoutes from '../api/apiRoutes';

const getOwnProfile = () => {
    return axios.get(apiRoutes.ownProfile, setAuthHeader());
}

const getOwnProfileDataForEdit = () => {
    return axios.get(apiRoutes.ownProfileDataForEdit, setAuthHeader());
}

const getProfile = (id: number) => {
    return axios.get(`${apiRoutes.profile}/${id}`, setAuthHeader());
}

const getAll = (name: string | null, categories: number[], cityId: number) => {
    let path = apiRoutes.allProfiles;
    
    if ((name !== null && name !== '') || categories.length !== 0 || cityId !== 0) {
        path = `${apiRoutes.allProfiles}?name=${name === null ? '' : name}&categories=${categories.join()}&cityId=${cityId}`;
    }
   
    return axios.get(path);
}

const profileApi = {
    getOwnProfile,
    getOwnProfileDataForEdit,
    getProfile,
    getAll
};

export default profileApi;