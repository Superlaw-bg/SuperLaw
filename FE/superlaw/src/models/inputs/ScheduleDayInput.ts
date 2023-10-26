import TimeSlotInput from "./TimeSlotInput";

interface ScheduleDayInput {
    date: Date,
    timeSlots: TimeSlotInput[],
}

export default ScheduleDayInput;