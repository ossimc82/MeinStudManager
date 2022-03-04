using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Models
{
    public class PagingResult<T> : IActionResult
    {
        public T[] Items { get; set; }
        public int Count => Items.Length;
        public int Page { get; set; }
        public int TotalCount { get; set; }

        private string? errorMessage;


        public PagingResult(IEnumerable<T> items, int page, int totalCount)
        {
            Items = items as T[] ?? items.ToArray();
            Page = page;
            TotalCount = totalCount;
        }

        public static PagingResult<T> CreatePagingResult(IEnumerable<T> collection, int count, int page)
        {
            if (count > 100)
                return Error("Count cannot be greater than 100");

            var enumerable = collection as T[] ?? collection.ToArray();
            return new PagingResult<T>(enumerable.Skip((page - 1) * count).Take(count), page, enumerable.Count());
        }

        private static PagingResult<T> Error(string message)
        {
            return new PagingResult<T>(Enumerable.Empty<T>(), 1, 0)
            {
                errorMessage = message
            };
        }

        public async Task ExecuteResultAsync(ActionContext context)
        {
            IActionResult result = errorMessage switch
            {
                null => new OkObjectResult(this),
                _ => new BadRequestObjectResult(errorMessage)
            };

            await result.ExecuteResultAsync(context);
        }
    }
}
