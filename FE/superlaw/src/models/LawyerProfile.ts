import SimpleData from "./SimpleData";
import SimpleMeeting from "./SimpleMeeting";
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
    rating: number,
    city: string,
    regions: SimpleData[],
    schedule: ScheduleInput,
    meetings: { [date: string]: SimpleMeeting[]},
    isJunior: boolean,
    isCompleted: boolean
}

export default LawyerProfile;