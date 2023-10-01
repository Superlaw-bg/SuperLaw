import ScheduleInput from "./ScheduleInput";

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