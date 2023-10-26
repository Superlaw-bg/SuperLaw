import CreateScheduleInput from "./ScheduleDayInput";
import ScheduleInput from "./ScheduleInput";

//TODO: DELETE this and rename ProfileInputNew to ProfileInput
interface ProfileInput {
    image: Blob | string,
    description: string,
    hourlyRate: number,
    address: string,
    categories: [],
    regions: [],
    schedule: ScheduleInput,
    isJunior: boolean,
    isCompleted: boolean
}

export default ProfileInput;