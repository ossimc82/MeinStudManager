using System.Security.Claims;
using System.Security.Principal;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Identity;

namespace MeinStudManager.Extensions
{
    public static class UserManagerExtensions
    {
        public static Task<ApplicationUser> FindByIdentity(this UserManager<ApplicationUser> userManager,
            IIdentity? identity)
        {
            if (identity == null)
                throw new ArgumentException("Cannot find user when there is no identity");
            return userManager.FindByNameAsync(identity.Name);
        }
    }
}
