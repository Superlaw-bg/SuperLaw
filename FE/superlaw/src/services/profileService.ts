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

const profileService = {
    createProfile,
    editProfile,
    getOwnProfile,
    getOwnProfileDataForEdit
};

export default profileService;