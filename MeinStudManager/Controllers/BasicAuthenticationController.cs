using System.Security.Claims;
using MeinStudManager.Extensions;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SignInResult = Microsoft.AspNetCore.Mvc.SignInResult;

namespace MeinStudManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BasicAuthenticatedController : ControllerBase
    {
        protected UserManager<ApplicationUser> UserManager { get; init; }

        public BasicAuthenticatedController(UserManager<ApplicationUser> userManager)
        {
            UserManager = userManager;
        }

        [NonAction]
        public Task<ApplicationUser> GetUser()
        {
            return UserManager.FindByIdentity(User.Identity);
        }
    }
}
