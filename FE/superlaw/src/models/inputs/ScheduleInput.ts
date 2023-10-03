import TimeSlotInput from "./TimeSlotInput";

interface ScheduleInput {
    monday: TimeSlotInput[],
    tuesday: TimeSlotInput[],
    wednesday: TimeSlotInput[],
    thursday: TimeSlotInput[],
    friday: TimeSlotInput[],
    saturday: TimeSlotInput[],
    sunday: TimeSlotInput[]
}

export default ScheduleInput;