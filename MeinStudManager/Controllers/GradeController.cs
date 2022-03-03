using System.Security.Cryptography.X509Certificates;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace MeinStudManager.Controllers
{
    public class GradeController : BasicAuthenticatedController
    {
        public GradeController(UserManager<ApplicationUser> userManager) : base(userManager)
        {
        }

        /// <summary>
        /// Lists all grades for the current user.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">If the request was successful.</response>
        [HttpGet("list")]
        [ProducesResponseType(typeof(GradesResult), StatusCodes.Status200OK)]
        public async Task<IActionResult> ListGrades()
        {
            return new GradesResult
            {
                StudySections = new List<StudySection>
                {
                    new ("1. Studienabschnitt")
                    {
                        Subjects = new List<Subject>
                        {
                            new("Mathe 1", 4.0, 5),
                            new("Theoretische informatik", 1.0, 5),
                            new("Programmieren 1", 1.0, 5),
                            new("Programmieren 2", 2.0, 5),
                            new("Rechnerarchitektur", 4.0, 3),
                            new("Information Engineering", 4.0, 5)
                        }
                    },
                    new ("2. Studienabschnitt")
                    {
                        Subjects = new List<Subject>
                        {
                            new("Rechnernetze", 3.0, 5),
                            new("IT-Security", 3.7, 5),
                            new("Datenbanksysteme Grundlagen", 1.0, 5),
                            new("Softwareentwicklung", 1.0, 5)
                        }
                    },
                    new ("Wahlpflichtfächer")
                    {
                        Subjects = new List<Subject>
                        {
                            new("Datenbanksysteme Vertiefung 1", 1.7, 5),
                            new("Datenbanksysteme Vertiefung 2", 1.7, 5),
                            new("Netzwerkplanung", 2.0, 5),
                            new("Grundlagen Webtechnik", 2.0, 5),
                            new("Vertiefung Softwareentwurf", 1.0, 5)
                        }
                    }
                }
            };
        }
    }
}
