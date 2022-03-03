using System.Net.Mime;
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

        /// <summary>
        /// Displays information about a user
        /// </summary>
        /// <param name="userId">The id of the user</param>
        /// <returns></returns>
        /// <response code="200">If the request was successful.</response>
        [HttpGet("{userId:guid}")]
        [ProducesResponseType(typeof(ApplicationUserDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserInfo(Guid userId)
        {
            var user = await UserManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return BadRequest("User not found");

            var userInfo = new ApplicationUserDto();
            user.CopyPropertiesTo(userInfo);

            return Ok(userInfo);
        }

        /// <summary>
        /// Updates the users information
        /// </summary>
        /// <param name="userId">The id of the user to update</param>
        /// <returns></returns>
        /// <response code="200">If the request was successful.</response>
        [HttpPut("{userId:guid}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(ApplicationUserDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateUserInfo([FromRoute] Guid userId, [FromBody] ApplicationUserDto data)
        {
            var user = await GetUser();
            if (userId.ToString() != user.Id)
                return BadRequest("Das bist nich du mein freund.");

            data.CopyPropertiesTo(user, nameof(data.Id), nameof(data.EmailConfirmed), nameof(data.TwoFactorEnabled));

            var result = await UserManager.UpdateAsync(user);
            return !result.Succeeded ? Problem(result.Errors.Select(_ => _.Description).ToArray()) : Ok(data);
        }
    }
}
