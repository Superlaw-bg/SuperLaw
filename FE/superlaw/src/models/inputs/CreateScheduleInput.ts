import TimeSlotInput from "./TimeSlotInput";

interface CreateScheduleInput {
    date: Date,
    timeslots: TimeSlotInput[],
}

export default CreateScheduleInput;