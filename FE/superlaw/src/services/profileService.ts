import requester from './requester';
import apiRoutes from './apiRoutes';
import Result from '../models/Result';
import LawyerProfile from '../models/LawyerProfile';
import LawyerProfileForEdit from '../models/LawyerProfileForEdit';

const createProfile: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.postFile(apiRoutes.createProfile, input);
    
    return res;
}

const editProfile: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.postFile(apiRoutes.editProfile, input);
    
    return res;
}

const getOwnProfile: () => Promise<LawyerProfile | null> = async () => {
    const res = await requester.get(apiRoutes.ownProfile);
    
    return res;
}

const getOwnProfileDataForEdit: () => Promise<LawyerProfileForEdit> = async () => {
    const res = await requester.get(apiRoutes.ownProfileDataForEdit);
    
    return res;
}

const getProfile: (id: number) => Promise<LawyerProfile | null> = async (id) => {
    const res = await requester.get(`${apiRoutes.profile}/${id}`);
    
    return res;
}

const getAll: (name: string | null, categories: number[], regions: number[]) => Promise<LawyerProfile[]> = async (name, categories, regions) => {
    let path = apiRoutes.allProfiles;
    
    if ((name !== null && name !== '') || categories.length !== 0 || regions.length !== 0) {
        path = `${apiRoutes.allProfiles}?name=${name === null ? '' : name}&categories=${categories.join()}&regions=${regions.join()}`;
    }
   
    const res = await requester.get(path);
    
    return res;
}

const profileService = {
    createProfile,
    editProfile,
    getOwnProfile,
    getProfile,
    getOwnProfileDataForEdit,
    getAll
};

export default profileService;