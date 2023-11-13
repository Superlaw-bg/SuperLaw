import axios from "./Api";
import { setAuthHeader } from "./Api";
import apiRoutes from '../api/apiRoutes';
import BookMeetingData from "../models/BookMeetingData";
import RateMeetingInput from "../models/inputs/RateMeetingInput";

const createMeeting = (data: BookMeetingData) => {
    return axios.post(apiRoutes.createMeeting, data, setAuthHeader());
}

const rateMeeting = (input: RateMeetingInput) => {
    return axios.post(apiRoutes.rateMeeting, input, setAuthHeader());
}

const getAllForCurrentUser = () => {   
    return axios.get(apiRoutes.meetingsForUser, setAuthHeader());
}

const meetingApi = {
    createMeeting,
    rateMeeting,
    getAllForCurrentUser
};

export default meetingApi;