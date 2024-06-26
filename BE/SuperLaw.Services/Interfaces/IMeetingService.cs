﻿using SuperLaw.Services.DTO;
using SuperLaw.Services.Input;

namespace SuperLaw.Services.Interfaces
{
    public interface IMeetingService
    {
        Task CreateMeetingAsync(string userId, CreateMeetingInput input);

        Task RateMeetingAsync(string userId, RateMeetingInput input);

        List<MeetingSimpleDto> GetUpcomingLawyerMeetings(int profileId);

        Task<MeetingsDto> GetAllForUserAsync(string userId);
    }
}
