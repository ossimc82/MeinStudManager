using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Extensions;

public static class GeneralExtensions
{
    public static ObjectResult AsJson(this ObjectResult result)
    {
        result.ContentTypes.Clear();
        result.ContentTypes.Add("application/json");
        return result;
    }
}