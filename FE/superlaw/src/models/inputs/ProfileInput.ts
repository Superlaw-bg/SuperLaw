import CreateScheduleInput from "./ScheduleDayInput";

interface ProfileInput {
    image: File | null,
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