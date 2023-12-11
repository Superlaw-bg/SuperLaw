import axios from "./Api";
import apiRoutes from '../api/apiRoutes';

const getOwnProfile = () => {
    return axios.get(apiRoutes.ownProfile);
}

const getOwnProfileDataForEdit = () => {
    return axios.get(apiRoutes.ownProfileDataForEdit);
}

const getProfile = (id: number) => {
    return axios.get(`${apiRoutes.profile}/${id}`);
}

const getAll = (name: string | null, categories: number[], cityId: number) => {
    let path = apiRoutes.allProfiles;
    
    if ((name !== null && name !== '') || categories.length !== 0 || cityId !== 0) {
        path = `${apiRoutes.allProfiles}?name=${name === null ? '' : name}&categories=${categories.join()}&cityId=${cityId}`;
    }
   
    return axios.get(path);
}

const uploadPicture = (profileId: number, file: File | null) => {
    if (file === null) {
        return;
    }

    const formData = new FormData();
    formData.append("picture", file);

    return axios.post(`${apiRoutes.uploadPicture}?profileId=${profileId}`, formData);
};

const createProfile = (profileInput: any) => {
    return axios.post(apiRoutes.createProfile, profileInput);
}

const editProfile = (profileInput: any) => {
    return axios.post(apiRoutes.editProfile, profileInput);
}

const profileApi = {
    getOwnProfile,
    getOwnProfileDataForEdit,
    getProfile,
    getAll,
    uploadPicture,
    createProfile,
    editProfile
};

export default profileApi;