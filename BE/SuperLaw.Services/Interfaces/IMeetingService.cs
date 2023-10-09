using SuperLaw.Services.Input;

namespace SuperLaw.Services.Interfaces
{
    public interface IMeetingService
    {
        Task CreateMeetingAsync(string userId, CreateMeetingInput input);
    }
}
