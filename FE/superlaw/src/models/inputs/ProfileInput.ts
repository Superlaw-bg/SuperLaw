import CreateScheduleInput from "./ScheduleDayInput";

//TODO: DELETE this and rename ProfileInputNew to ProfileInput
interface ProfileInput {
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

export default ProfileInput;