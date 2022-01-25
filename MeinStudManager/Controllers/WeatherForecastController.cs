using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using MeinStudManager.Data;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Controllers;

[ApiController]
[Authorize]
[Route("/api/[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;
    private readonly ApplicationDbContext _db;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, ApplicationDbContext db)
    {
        _logger = logger;
        _db = db;
    }

    /// <summary>
    /// Requests weather at specific date
    /// </summary>
    /// <param name="dateTime">The start time</param>
    /// <param name="mistHaufen" required="true">Mist halt</param>
    /// <param name="count" default="5" optional="true">Number of weathers</param>
    /// <returns>an array of weather data</returns>

    [HttpGet("{dateTime:datetime}")]
    public IEnumerable<WeatherForecast> Get(DateTime dateTime, [FromQuery(Name = "mist")] [Required] string mistHaufen, [FromQuery(Name = "count")] int count=5)
    {
        return Enumerable.Range(1, count).Select(index => new WeatherForecast
            {
                Date = dateTime.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
    }

    /// <summary>
    /// Requests weather now
    /// </summary>
    /// <returns>an array of weather data</returns>
    [HttpGet]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateTime.Now.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
