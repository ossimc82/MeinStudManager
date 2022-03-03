using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Models
{
    public class Subject
    {
        public Subject(string name, double grade, int credits)
        {
            Name = name;
            Grade = grade;
            Credits = credits;
        }

        public Subject()
        {
            Name = "";
        }

        public string Name { get; set; }
        public double Grade { get; set; }
        public int Credits { get; set; }
    }

    public class StudySection
    {
        public StudySection(string name)
        {
            Name = name;
        }

        public StudySection()
        {
            Name = "";
        }

        public string Name { get; set; }
        public List<Subject> Subjects { get; set; } = new();
    }

    public class GradesResult : IActionResult
    {
        public List<StudySection> StudySections { get; set; } = new();

        public async Task ExecuteResultAsync(ActionContext context)
        {
            await new OkObjectResult(this).ExecuteResultAsync(context);
        }
    }
}
