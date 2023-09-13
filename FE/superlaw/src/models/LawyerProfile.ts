import SimpleData from "./SimpleData";

interface LawyerProfile {
    id: number,
    image: string,
    description: string,
    hourlyRate: number,
    phone: string,
    address: string,
    categories: SimpleData[],
    regions: SimpleData[],
    isJunior: boolean,
    isCompleted: boolean
}

export default LawyerProfile;