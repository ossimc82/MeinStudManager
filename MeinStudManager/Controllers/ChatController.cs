using System.Net;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Controllers
{
    public class ChatController : BasicAuthenticatedController
    {
        public ChatController(UserManager<ApplicationUser> userManager) : base(userManager)
        {
        }
    }
}
