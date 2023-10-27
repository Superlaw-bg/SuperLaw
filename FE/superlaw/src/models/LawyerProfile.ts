import ScheduleDay from "./ScheduleDay";
import SimpleData from "./SimpleData";

interface LawyerProfile {
    id: number,
    imgPath: string,
    fullName: string,
    description: string,
    hourlyRate: number,
    phone: string,
    address: string,
    categories: SimpleData[],
    rating: number,
    city: string,
    regions: SimpleData[],
    schedule: ScheduleDay[],
    isJunior: boolean,
    isCompleted: boolean
}

export default LawyerProfile;