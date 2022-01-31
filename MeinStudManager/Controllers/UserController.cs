using System.IdentityModel.Tokens.Jwt;
using System.Security.AccessControl;
using System.Security.Claims;
using MeinStudManager.Authorization;
using MeinStudManager.Data;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly MsmJwtSecurityTokenHandler jwt;

        public UserController(ApplicationDbContext db, UserManager<ApplicationUser> userManager,
            MsmJwtSecurityTokenHandler jwt)
        {
            this.db = db;
            this.userManager = userManager;
            this.jwt = jwt;
        }

        /// <summary>
        /// Creates a new user in the database.
        /// </summary>
        /// <param name="formData">Register information</param>
        /// <returns></returns>
        /// <response code="201">If the user was created successful. Returns the users unique identifier</response>
        /// <response code="400">If one or more errors occurred.</response>
        /// <response code="500">If something very critical goes wrong in the server backend.</response>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = null!)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ProblemDetails))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegisterDto? formData)
        {
            if (formData == null)
                return BadRequest("Form data cannot be null or empty");

            var user = new ApplicationUser
            {
                Email = formData.Email,
                UserName = formData.UserName
            };

            var result = await userManager.CreateAsync(user, formData.Password);

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, RoleHelper.Role_Students);
                return StatusCode(StatusCodes.Status201Created, user.Id);
            }

            var problem = ProblemDetailsFactory.CreateProblemDetails(HttpContext,
                StatusCodes.Status400BadRequest, "Could not create user.",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1");
            problem.Extensions.Add("errors", result.Errors.ToDictionary(_ => _.Code, _ => new[] { _.Description }));

            return BadRequest(problem);
        }

        /// <summary>
        /// Logs the user in.
        /// </summary>
        /// <param name="formData">Login information</param>
        /// <returns></returns>
        /// <response code="200">If the user was logged in successful. Returns the users jwt token</response>
        /// <response code="400">If one or more validation errors occurred.</response>
        /// <response code="401">If the user credentials are incorrect.</response>
        /// <response code="500">If something very critical goes wrong in the server backend.</response>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResultDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ProblemDetails))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(LoginResultDto))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] UserLoginDto formData)
        {
            var user = await userManager.FindByEmailAsync(formData.Ident) ??
                       await userManager.FindByNameAsync(formData.Ident);

            if (user == null || !await userManager.CheckPasswordAsync(user, formData.Password))
                return Unauthorized(new LoginResultDto
                {
                    IsAuthSuccessful = false,
                    ErrorMessage = "Incorrect email or password"
                });

            var token = await jwt.SignInUser(db, user);
            return Ok(new LoginResultDto
            {
                IsAuthSuccessful = true,
                ErrorMessage = null,
                Token = token
            });
        }

        /// <summary>
        /// Logs the user out.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">If the user was logged out successful. Returns nothing</response>
        /// <response code="401">If the user is not authorized or the jwt token has expired.</response>
        /// <response code="500">If something very critical goes wrong in the server backend.</response>
        [Authorize]
        [HttpGet("logout")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = null!)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = null!)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Logout()
        {
            var user = await userManager.FindByNameAsync(HttpContext.User.Identity?.Name);
            if (user == null) //should not happen here
                return Unauthorized();

            await jwt.SignOutUser(db, user);
            return Ok();
        }
    }
}
