import SimpleData from "./SimpleData";
import ScheduleInput from "./inputs/ScheduleInput";

interface LawyerProfile {
    id: number,
    imgPath: string,
    fullName: string,
    description: string,
    hourlyRate: number,
    phone: string,
    address: string,
    categories: SimpleData[],
    regions: SimpleData[],
    schedule: ScheduleInput,
    isJunior: boolean,
    isCompleted: boolean
}

export default LawyerProfile;