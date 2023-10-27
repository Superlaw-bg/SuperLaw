import ScheduleDayInput from "./inputs/ScheduleDayInput";

interface LawyerProfileForEdit {
    id: number,
    description: string,
    hourlyRate: number,
    address: string,
    categories: [],
    regions: [],
    schedule: ScheduleDayInput[],
    isJunior: boolean,
    isCompleted: boolean
}

export default LawyerProfileForEdit;