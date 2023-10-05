import requester from './requester';
import apiRoutes from './apiRoutes';
import Result from '../models/Result';

const createMeeting: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.post(apiRoutes.createMeeting, input);
    
    return res;
}


const meetingService = {
    createMeeting,
};

export default meetingService;