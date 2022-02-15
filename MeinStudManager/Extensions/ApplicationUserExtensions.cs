using MeinStudManager.Models;

namespace MeinStudManager.Extensions
{
    public static class ApplicationUserExtensions
    {
        public static Guid Guid(this ApplicationUser user)
        {
            return System.Guid.Parse(user.Id);
        }
    }
}
