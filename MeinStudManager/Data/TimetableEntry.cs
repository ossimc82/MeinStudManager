using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MeinStudManager.Models;

namespace MeinStudManager.Data
{
    public class TimetableEntry : TimeTableInfoDto
    {
        [ForeignKey(nameof(UserId))] public string UserId { get; set; } = null!;
    }
}
