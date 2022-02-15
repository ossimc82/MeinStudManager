using MeinStudManager.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Controllers
{
    public class ForumController : BasicAuthenticatedController
    {
        public ForumController(UserManager<ApplicationUser> userManager) : base(userManager)
        {
        }
    }
}
