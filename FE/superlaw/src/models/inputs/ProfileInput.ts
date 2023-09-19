interface ProfileInput {
    image: Blob | string,
    description: string,
    hourlyRate: number,
    address: string,
    categories: [],
    regions: [],
    isJunior: boolean,
    isCompleted: boolean
}

export default ProfileInput;