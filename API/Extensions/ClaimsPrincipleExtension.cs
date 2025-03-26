using System;
using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipleExtension
{
    public static string GetUserName(this ClaimsPrincipal user)
    {
        var userName = user.FindFirstValue(ClaimTypes.Name) ?? throw new InvalidOperationException("User not found from token");
        return userName;
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException("User not found from token"));
        return userId;
    }
}
