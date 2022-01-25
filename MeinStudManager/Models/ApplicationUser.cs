using Microsoft.AspNetCore.Identity;

namespace MeinStudManager.Models
{
    public class ApplicationUser : IdentityUser
    {
        //TODO firstName, lastName
        //TODO: maybe more to allow concurrent logins?
        public string SecurityToken { get; set; } = string.Empty;
    }
}
