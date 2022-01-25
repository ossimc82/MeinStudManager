using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MeinStudManager.Data;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace MeinStudManager.Authorization
{
    public class MsmJwtSecurityTokenHandler : ISecurityTokenValidator
    {
        private readonly JwtSecurityTokenHandler tokenHandler;
        private IHttpContextAccessor httpContextAccessor;
        private IServiceProvider serviceProvider;
        private JwtHandler jwtHandler;

        public MsmJwtSecurityTokenHandler()
        {
            tokenHandler = new JwtSecurityTokenHandler();
        }

        public void Configure(IServiceProvider serviceProvider)
        {
            this.httpContextAccessor = serviceProvider.GetService<IHttpContextAccessor>()!;
            this.jwtHandler = new JwtHandler(serviceProvider.GetService<IConfiguration>()!);
            this.serviceProvider = serviceProvider;
        }

        public bool CanValidateToken => true;

        public int MaximumTokenSizeInBytes { get; set; } = TokenValidationParameters.DefaultMaximumTokenSizeInBytes;

        public bool CanReadToken(string securityToken)
        {
            var context = httpContextAccessor.HttpContext!;
            var securityTokenCanRead = tokenHandler.CanReadToken(securityToken);
            if (IsLoginPath())
                return securityTokenCanRead;

            var userManager = context.RequestServices.GetService<UserManager<ApplicationUser>>()!;
            var token = tokenHandler.ReadToken(securityToken) as JwtSecurityToken;
            var user = userManager.FindByNameAsync(token!.Claims.First(_ => _.Type == ClaimTypes.Name)?.Value).Result;
            
            if (securityTokenCanRead && user != null && user.SecurityToken != securityToken)
                return false;
            
            return securityTokenCanRead;
        }

        public ClaimsPrincipal ValidateToken(string securityToken, TokenValidationParameters validationParameters,
            out SecurityToken validatedToken)
        {
            return tokenHandler.ValidateToken(securityToken, validationParameters, out validatedToken);
        }

        public async Task<string> SignInUser(ApplicationDbContext db, ApplicationUser user)
        {
            var signingCredentials = jwtHandler.GetSigningCredentials();
            var claims = jwtHandler.GetClaims(user);
            var tokenOptions = jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            user.SecurityToken = token;
            await db.SaveChangesAsync();
            return token;
        }

        public async Task SignOutUser(ApplicationDbContext db, ApplicationUser user)
        {
            user.SecurityToken = String.Empty;
            await db.SaveChangesAsync();
        }

        private bool IsLoginPath()
        {
            return httpContextAccessor.HttpContext!.Request.Path.ToString().ToLower() == "/api/user/login";
        }
    }
}