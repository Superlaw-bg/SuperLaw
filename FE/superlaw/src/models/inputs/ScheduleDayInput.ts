import TimeSlot from "../TimeSlot";
import TimeSlotInput from "./TimeSlotInput";

interface ScheduleDayInput {
    date: Date,
    timeSlots: TimeSlot[],
}

export default ScheduleDayInput;