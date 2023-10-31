import CreateScheduleInput from "./ScheduleDayInput";

interface ProfileInput {
    image: Blob | string,
    description: string,
    rate: number,
    address: string,
    categories: [],
    regions: [],
    schedule: CreateScheduleInput[],
    isJunior: boolean,
    isCompleted: boolean
}

export default ProfileInput;