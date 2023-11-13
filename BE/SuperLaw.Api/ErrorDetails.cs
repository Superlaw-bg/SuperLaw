using System.Text.Json;

namespace SuperLaw.Api
{
    public class ErrorDetails
    {
        public int StatusCode { get; set; }
        public string message { get; set; }
        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }
    }
}
