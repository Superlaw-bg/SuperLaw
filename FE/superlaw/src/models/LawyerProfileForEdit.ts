import ScheduleInput from "./inputs/ScheduleInput";

interface LawyerProfileForEdit {
    id: number,
    description: string,
    hourlyRate: number,
    address: string,
    categories: [],
    regions: [],
    schedule: ScheduleInput,
    isJunior: boolean,
    isCompleted: boolean
}

export default LawyerProfileForEdit;