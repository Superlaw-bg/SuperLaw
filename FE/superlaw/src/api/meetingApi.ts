import axios from "./Api";
import apiRoutes from '../api/apiRoutes';
import BookMeetingData from "../models/BookMeetingData";
import RateMeetingInput from "../models/inputs/RateMeetingInput";

const createMeeting = (data: BookMeetingData) => {
    return axios.post(apiRoutes.createMeeting, data);
}

const rateMeeting = (input: RateMeetingInput) => {
    return axios.post(apiRoutes.rateMeeting, input);
}

const getAllForCurrentUser = () => {   
    return axios.get(apiRoutes.meetingsForUser);
}

const meetingApi = {
    createMeeting,
    rateMeeting,
    getAllForCurrentUser
};

export default meetingApi;