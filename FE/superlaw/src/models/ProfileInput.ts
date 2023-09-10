interface ProfileInput {
    profilePic: Blob | null,
    description: string,
    hourlyRate: number,
    address: string,
    categories: [],
    regions: [],
    isJunior: boolean,
    isCompleted: boolean
}

export default ProfileInput;