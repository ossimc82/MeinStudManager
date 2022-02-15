using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace MeinStudManager.Models
{
    public class ApplicationUserDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        [Editable(false)]
        public string Email { get; set; }
        [Editable(false)]
        public bool EmailConfirmed { get; set; }
        public string PhoneNumber { get; set; }
        [Editable(false)]
        public bool TwoFactorEnabled { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class ApplicationUser : IdentityUser
    {
        //TODO firstName, lastName
        //TODO: maybe more to allow concurrent logins?
        public string SecurityToken { get; set; } = string.Empty;

        [PersonalData]
        public string? FirstName { get; set; }

        [PersonalData]
        public string? LastName { get; set; }
    }
}
