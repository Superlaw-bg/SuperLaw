import requester from './requester';
import apiRoutes from './apiRoutes';
import Result from '../models/Result';
import ProfileInput from '../models/ProfileInput';

const createProfile: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.postFile(apiRoutes.createProfile, input);
    
    return res;
}

const profileService = {
    createProfile
};

export default profileService;