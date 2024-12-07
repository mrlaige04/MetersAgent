using System.Security.Claims;
using Application.Abstractions;

namespace Api.Services;

public class CurrentUser(IHttpContextAccessor contextAccessor) : ICurrentUser
{
    public string? UserId =>
        contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
}