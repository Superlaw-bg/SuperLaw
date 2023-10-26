import CreateScheduleInput from "./ScheduleDayInput";
import ScheduleInput from "./ScheduleInput";

//TODO: DELETE this and rename ProfileInputNew to ProfileInput
interface ProfileInputNew {
    image: Blob | string,
    description: string,
    hourlyRate: number,
    address: string,
    categories: [],
    regions: [],
    schedule: CreateScheduleInput[],
    isJunior: boolean,
    isCompleted: boolean
}

export default ProfileInputNew;