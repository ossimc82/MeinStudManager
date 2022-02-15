using MeinStudManager.Data;
using MeinStudManager.Extensions;
using MeinStudManager.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimetableController : BasicAuthenticatedController
    {
        private readonly ApplicationDbContext db;

        public TimetableController(ApplicationDbContext db, UserManager<ApplicationUser> userManager) : base(userManager)
        {
            this.db = db;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        /// <response code="501">Not implemented.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status501NotImplemented)]
        public async Task<IActionResult> ListTimetableEntries([FromQuery]DateTime? begin = null, [FromQuery] DateTime? end = null)
        {
            begin ??= DateTime.MinValue;
            end ??= DateTime.MaxValue;

            var user = await GetUser();
            var entries = db.Timetables.Where(_ => 
                _.UserId == user.Id && _.StartTime >= begin && _.EndTime <= end);
            return Ok(entries);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        /// <response code="501">Not implemented.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status501NotImplemented)]
        public async Task<IActionResult> AddNewTimetableEntry([FromBody] TimeTableInfoDto data, CancellationToken cancellationToken)
        {
            var user = await GetUser();
            var entry = new TimetableEntry
            {
                UserId = user.Id
            };

            data.CopyPropertiesTo(entry);
            var result = await db.AddAsync(entry, cancellationToken);
            await db.SaveChangesAsync(cancellationToken);
            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        /// <response code="501">Not implemented.</response>
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status501NotImplemented)]
        public async Task<IActionResult> DeleteTimetableEntry(Guid id)
        {
            var user = await GetUser();
            var entry = await db.FindAsync<TimetableEntry>(id);
            if (entry == null)
                return BadRequest("No timetable entry found with this id");
            var e = db.Remove(entry);
            await db.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        /// <response code="501">Not implemented.</response>
        [HttpPut("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status501NotImplemented)]
        public async Task<IActionResult> UpdateTimetableEntry([FromRoute]Guid id, [FromBody]TimeTableInfoDto data, CancellationToken cancellationToken)
        {
            var user = await GetUser();

            var entry = await db.Timetables.FindAsync(new object[] { id }, cancellationToken);
            if (entry == null)
                return BadRequest("Invalid Id");

            if (entry.UserId != user.Id)
                return BadRequest("Kannste knicken, das is nich deins du lackaffe");

            data.CopyPropertiesTo(entry, nameof(entry.UserId), nameof(entry.Id));
            var result = await db.SaveChangesAsync(cancellationToken);

            return Ok();
        }
    }
}
