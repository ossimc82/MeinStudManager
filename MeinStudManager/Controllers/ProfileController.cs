using MeinStudManager.Data;
using MeinStudManager.Extensions;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Controllers
{
    public class ProfileController : BasicAuthenticatedController
    {
        private readonly ApplicationDbContext db;

        public ProfileController(ApplicationDbContext db, UserManager<ApplicationUser> userManager) : base(userManager)
        {
            this.db = db;
        }

        [HttpGet("{userId:guid}")]
        public async Task<IActionResult> GetUserInfo(Guid userId)
        {
            var user = await UserManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return BadRequest("User not found");

            var userInfo = new ApplicationUserDto();
            user.CopyPropertiesTo(userInfo);

            return Ok(userInfo);
        }

        [HttpPut("{userId:guid}")]
        public async Task<IActionResult> UpdateUserInfo([FromRoute]Guid userId, ApplicationUserDto data)
        {
            var user = await GetUser();
            if (userId.ToString() != user.Id)
                return BadRequest("Das bist nich du mein freund.");

            data.CopyPropertiesTo(user, nameof(data.Id), nameof(data.EmailConfirmed), nameof(data.TwoFactorEnabled));

            await UserManager.UpdateAsync(user);

            return Ok(user);
        }
    }
}
