interface TimeSlot {
    id: number,
    from: string,
    to: string,
    hasMeeting: boolean,
    clientName: string | null
}

export default TimeSlot;