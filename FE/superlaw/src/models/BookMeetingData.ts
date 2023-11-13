import TimeSlot from "./TimeSlot";

interface BookMeetingData {
    date: Date | null,
    timeslot: TimeSlot,
    categoryId: number,
    info: string,
    profileId: number
}

export default BookMeetingData;