import ScheduleDay from "./ScheduleDay";
import SimpleData from "./SimpleData";
import SimpleMeeting from "./SimpleMeeting";

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
    meetings: { [date: string]: SimpleMeeting[]},
    isJunior: boolean,
    isCompleted: boolean
}

export default LawyerProfile;