using System.Net.Mime;
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
    /// <summary>
    /// 
    /// </summary>
    /// <response code="401">If the user is not logged in.</response>
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    [ProducesResponseType(typeof(void), StatusCodes.Status401Unauthorized)]
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

        [NonAction]
        public IActionResult Problem(params string[] errors)
        {
            var problem = ProblemDetailsFactory.CreateProblemDetails(HttpContext,
                StatusCodes.Status400BadRequest, "Could not create user.",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1");
            problem.Extensions.Add("errors", errors);

            return BadRequest(problem);
        }
    }
}
