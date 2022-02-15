using System.Reflection;
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

    public static void CopyPropertiesTo(this object source, object destination, params string[] excludeProperties)
    {
        if (source == null || destination == null)
            throw new Exception("Source or/and Destination Objects are null");

        var typeDest = destination.GetType();
        var typeSrc = source.GetType();

        var srcProps = typeSrc.GetProperties();
        foreach (var srcProp in srcProps)
        {
            if (!srcProp.CanRead)
                continue;

            var targetProperty = typeDest.GetProperty(srcProp.Name);
            if (targetProperty is null || !targetProperty.CanWrite || excludeProperties.Contains(targetProperty.Name))
                continue;

            var setter = targetProperty.GetSetMethod();
            if (setter is null || (setter.Attributes & MethodAttributes.Static) != 0)
                continue;

            if (!targetProperty.PropertyType.IsAssignableFrom(srcProp.PropertyType))
                continue;

            targetProperty.SetValue(destination, srcProp.GetValue(source, null), null);
        }
    }
}