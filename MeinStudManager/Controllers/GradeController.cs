using System.Net.Mime;
using System.Security.Cryptography.X509Certificates;
using MeinStudManager.Data;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;

namespace MeinStudManager.Controllers
{
    public class GradeController : BasicAuthenticatedController
    {
        private readonly ApplicationDbContext db;

        public GradeController(UserManager<ApplicationUser> userManager, ApplicationDbContext db) : base(userManager)
        {
            this.db = db;
        }

#if DEBUG
        /// <summary>
        /// DEBUG ONLY. To populate the database with some default values
        /// </summary>
        /// <returns></returns>
        /// <response code="200">If the request was successful.</response>
        [HttpGet("defaults")]
        public async Task<IActionResult> PopulateDefaults()
        {
            var user = await GetUser();
            var gradesResult = new GradesResult
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

            await db.Grades.AddRangeAsync(gradesResult.StudySections
                .SelectMany(sec => sec.Subjects, (sec, sub) =>
                    new GradeEntry
                    {
                        UserId = user.Id,
                        StudySection = sec.Name,
                        Subject = sub.Name,
                        Grade = sub.Grade,
                        Credits = sub.Credits
                    }));

            await db.SaveChangesAsync();

            return Ok();
        }
#endif

        /// <summary>
        /// Lists all grades for the current user.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">If the request was successful.</response>
        [HttpGet]
        [ProducesResponseType(typeof(GradesResult), StatusCodes.Status200OK)]
        public async Task<IActionResult> ListGrades()
        {
            var user = await GetUser();
            var enumerable = db.Grades.Where(_ => _.UserId == user.Id).AsAsyncEnumerable();

            var result = new GradesResult();

            await foreach (var grade in enumerable)
            {
                if (result.StudySections.All(_ => _.Name != grade.StudySection))
                    result.StudySections.Add(new StudySection(grade.StudySection));

                var sec = result.StudySections.First(_ => _.Name == grade.StudySection);
                sec.Subjects.Add(new Subject(grade.Subject, grade.Grade, grade.Credits));
            }

            return result;
        }

        /// <summary>
        /// Adds a new grade.
        /// </summary>
        /// <returns></returns>
        /// <response code="201">If the request was successful.</response>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(string), StatusCodes.Status201Created)]
        public async Task<IActionResult> AddNewGrade([FromBody] GradesPostDto data)
        {
            var user = await GetUser();
            var grade = await db.Grades.FindAsync(user.Id, data.Subject);

            if (grade != null)
                return BadRequest("grade already exists");

            await db.Grades.AddAsync(new GradeEntry
            {
                UserId = user.Id,
                StudySection = data.StudySection,
                Subject = data.Subject,
                Grade = data.Grade,
                Credits = data.Credits
            });

            await db.SaveChangesAsync();
            return StatusCode(StatusCodes.Status201Created, "Success");
        }

        /// <summary>
        /// Edits a grade.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        /// <response code="200">If the grade was edited successful.</response>
        [HttpPut]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public async Task<IActionResult> EditGrade([FromBody] GradesPostDto data)
        {
            var user = await GetUser();
            var grade = await db.Grades.FindAsync(user.Id, data.Subject);

            if (grade == null)
                return BadRequest("grade not found");

            var gradeEn = db.Grades.Attach(grade);
            gradeEn.Entity.Grade = data.Grade;
            await db.SaveChangesAsync();
            return Ok("Success");
        }

        /// <summary>
        /// Deletes a grade
        /// </summary>
        /// <returns></returns>
        /// <response code="200">If the grade was successfully deleted.</response>
        [HttpPost("delete")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteGrade([FromBody] GradesPostDto data)
        {
            var user = await GetUser();
            var grade = await db.Grades.FindAsync(user.Id, data.Subject);

            if (grade == null)
                return BadRequest("grade not found");

            db.Grades.Remove(grade);
            await db.SaveChangesAsync();
            return Ok("Success");
        }
    }
}
