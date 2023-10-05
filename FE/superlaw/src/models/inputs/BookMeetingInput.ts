import TimeSlotInput from "./TimeSlotInput";

interface BookMeetingInput {
    date: Date | null,
    timeslot: TimeSlotInput,
    categoryId: number,
    regionId: number,
    info: string
}

export default BookMeetingInput;