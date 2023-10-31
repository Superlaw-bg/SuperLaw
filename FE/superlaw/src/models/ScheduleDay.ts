import TimeSlot from "./TimeSlot";

interface ScheduleDay {
    date: Date,
    timeSlots: TimeSlot[],
}

export default ScheduleDay;