import TimeSlot from "../TimeSlot";

interface BookMeetingInput {
    date: Date | null,
    timeslot: TimeSlot,
    categoryId: number,
    info: string
}

export default BookMeetingInput;