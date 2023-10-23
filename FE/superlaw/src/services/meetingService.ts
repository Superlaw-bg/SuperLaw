import requester from './requester';
import apiRoutes from './apiRoutes';
import Result from '../models/Result';
import LawyerProfile from '../models/LawyerProfile';
import TimeSlotInput from '../models/inputs/TimeSlotInput';
import TimeSlotSelect from '../models/TimeSlotSelect';
import MeetingsPageData from '../models/MeetingsPageData';
import RateMeetingInput from '../models/inputs/RateMeetingInput';

const createMeeting: (input: any) => Promise<Result> = async (input) => {
    const res = await requester.post(apiRoutes.createMeeting, input);

    return res;
}

const rateMeeting: (input: RateMeetingInput) => Promise<Result> = async (input) => {
    const res = await requester.post(apiRoutes.rateMeeting, input);

    return res;
}

const getAllForCurrentUser: () => Promise<MeetingsPageData> = async () => {   
    const res = await requester.get(apiRoutes.meetingsForUser);
    
    return res;
}

const getMeetingsForDate = (date: Date, profile: LawyerProfile) => {
    let month = `${date.getMonth() + 1}`;
    let day = `${date.getDate()}`;

    if (date.getMonth() + 1 < 10) {
        month = `0${date.getMonth() + 1}`;
    }

    if (date.getDate() < 10) {
        day = `0${date.getDate()}`;
    }

    let meetingsKey = `${date.getFullYear()}-${month}-${day}T00:00:00`;

    const meetings = profile.meetings[meetingsKey];

    return meetings;
}

const isDayForMeetingsDisabled = (date: Date, timeSlots: TimeSlotInput[], profile: LawyerProfile) => {
    if (timeSlots.length === 0) {
        return true;
    }

    const todayDate = new Date();

    let todayHours = todayDate.getHours();
    let todayMinutes = todayDate.getMinutes();

    const meetingsForDatetest = meetingService.getMeetingsForDate(date, profile);

    if (date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()) {
        let occupiedCount = 0;

        for (let i = 0; i < timeSlots.length; i++) {
            let fromHours = Number(timeSlots[i].from.split(':')[0]);
            let fromMinutes = Number(timeSlots[i].from.split(':')[1]);

            if ((todayMinutes + ((todayHours + 1) * 60)) >= (fromMinutes + (fromHours * 60))) {
                occupiedCount++;
            }
        }

        if (occupiedCount === timeSlots.length) {
            return true;
        }

        if (meetingsForDatetest && meetingsForDatetest.length + occupiedCount >= timeSlots.length) {
            return true;
        }
    }
    const meetingsForDate = meetingService.getMeetingsForDate(date, profile);

    if (meetingsForDate && meetingsForDate.length === timeSlots.length) {
        return true;
    }

    return false;
}

const getTimeSlotsForSelectionForDate = (profile: LawyerProfile, timeSlots: TimeSlotInput[], date: Date) => {
    const todayDate = new Date();
    const meetingsForDate = meetingService.getMeetingsForDate(date, profile);

    let timeSlotsForSelections: TimeSlotSelect[] = [];

    for (let i = 0; i < timeSlots.length; i++) {
        timeSlotsForSelections.push({ from: timeSlots[i].from, to: timeSlots[i].to, isOccupied: false });
    }

    for (let i = 0; i < timeSlotsForSelections.length; i++) {

        //getDay returns day of the week, getDate returns the number of the day
        if (date.getMonth() === todayDate.getMonth() && date.getDate() === todayDate.getDate()) {
            let fromHours = Number(timeSlotsForSelections[i].from.split(':')[0]);
            let fromMinutes = Number(timeSlotsForSelections[i].from.split(':')[1]);

            let todayHours = todayDate.getHours();
            let todayMinutes = todayDate.getMinutes();

            if ((todayMinutes + ((todayHours + 1) * 60)) >= (fromMinutes + (fromHours * 60))) {
                timeSlotsForSelections[i].isOccupied = true;
            }
        }

        if (meetingsForDate) {

            let meeting = meetingsForDate.filter(x => x.from === timeSlotsForSelections[i].from && x.to === timeSlotsForSelections[i].to);

            if (meeting.length !== 0) {
                timeSlotsForSelections[i].isOccupied = true;
            }
        }

    }

    return timeSlotsForSelections;
}

const meetingService = {
    createMeeting,
    rateMeeting,
    getAllForCurrentUser,
    getMeetingsForDate,
    isDayForMeetingsDisabled,
    getTimeSlotsForSelectionForDate
};

export default meetingService;