interface Meeting {
    id: number,
    profileId: number,
    isUserTheLawyer: boolean,
    name: string,
    date: string,
    from: string,
    to: string,
    categoryName: string,
    regionName: string,
    info: string,
    rating: number
}

export default Meeting;