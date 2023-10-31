namespace SuperLaw.Common.Options
{
    public class CloudinaryOptions
    {
        public const string Section = "Cloudinary";

        public string CloudName { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
        public string ImgFolder { get; set; }
    }
}
