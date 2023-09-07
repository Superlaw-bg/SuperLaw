namespace SuperLaw.Common
{
    public class BusinessException : Exception
    {
        public BusinessException() : base() { }
        public BusinessException(string msg) : base(msg) { }
    }
}
