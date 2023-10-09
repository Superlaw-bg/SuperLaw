import requester from './requester';
import apiRoutes from './apiRoutes';
import Result from '../models/Result';
import LawyerProfile from '../models/LawyerProfile';

const createMeeting: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.post(apiRoutes.createMeeting, input);
    
    return res;
}

const getMeetingsForDate = (date: Date, profile: LawyerProfile) => {
    let month = `${date.getMonth() + 1}`;
    let day = `${date.getDate()}`;

    if(date.getMonth() + 1 < 10){
      month = `0${date.getMonth() + 1}`;
    }

    if(date.getDate() < 10){
      day = `0${date.getDate()}`;
    }

    let meetingsKey = `${date.getFullYear()}-${month}-${day}T00:00:00`;

    const meetings = profile.meetings[meetingsKey];

    return meetings;
}

const meetingService = {
    createMeeting,
    getMeetingsForDate
};

export default meetingService;