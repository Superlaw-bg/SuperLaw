import requester from './requester';
import apiRoutes from './apiRoutes';
import Result from '../models/Result';
import LawyerProfile from '../models/LawyerProfile';

const createProfile: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.postFile(apiRoutes.createProfile, input);
    
    return res;
}

const getOwnProfile: () => Promise<LawyerProfile | null> = async () => {
    const res = await requester.get(apiRoutes.ownProfile);
    
    return res;
}

const profileService = {
    createProfile,
    getOwnProfile
};

export default profileService;