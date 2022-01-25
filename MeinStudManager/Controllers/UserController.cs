using System.IdentityModel.Tokens.Jwt;
using System.Security.AccessControl;
using System.Security.Claims;
using MeinStudManager.Authorization;
using MeinStudManager.Data;
using MeinStudManager.Models;
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
        private readonly JwtHandler jwtHandler;

        public UserController(ApplicationDbContext db, UserManager<ApplicationUser> userManager,
            JwtHandler jwtHandler)
        {
            this.db = db;
            this.userManager = userManager;
            this.jwtHandler = jwtHandler;
        }

        /// <summary>
        /// Creates a new user in the database.
        /// </summary>
        /// <param name="formData">Register information</param>
        /// <returns></returns>
        /// <response code="201">If the user was created successful. Returns the users unique identifier</response>
        /// <response code="400">If one or more errors occured.</response>
        /// <response code="500">If something very critical goes wrong in the server backend.</response>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
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
                return StatusCode(StatusCodes.Status201Created, user.Id);

            var problem = ProblemDetailsFactory.CreateProblemDetails(HttpContext,
                StatusCodes.Status400BadRequest, "Could not create user.",
                "https://tools.ietf.org/html/rfc7231#section-6.5.1");
            problem.Extensions.Add("errors", result.Errors.ToDictionary(_ => _.Code, _ => new [] { _.Description }));

            return BadRequest(problem);
        }

        /// <summary>
        /// Logs the user in.
        /// </summary>
        /// <param name="formData">Login information</param>
        /// <returns></returns>
        /// <response code="200">If the user was logged in successful. Returns the users jwt token</response>
        /// <response code="400">If one or more validation errors occured.</response>
        /// <response code="401">If the user credentials are incorrect.</response>
        /// <response code="500">If something very critical goes wrong in the server backend.</response>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(ProblemDetails))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] UserLoginDto formData)
        {
            var user = await userManager.FindByEmailAsync(formData.Email);

            if (user == null || !await userManager.CheckPasswordAsync(user, formData.Password))
                return Unauthorized("Incorrect email or password");

            //TODO: store the token in database and add custom authorize handler to determine if a user logged out

            var signingCredentials = jwtHandler.GetSigningCredentials();
            var claims = jwtHandler.GetClaims(user);
            var tokenOptions = jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return Ok(token);
        }

        [Authorize]
        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            //TODO delete token from db
            return StatusCode(StatusCodes.Status503ServiceUnavailable);
        }
    }
}
