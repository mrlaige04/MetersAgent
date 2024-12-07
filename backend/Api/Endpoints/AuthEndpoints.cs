using Application.Authentication.Login;
using Application.Authentication.Register;
using ErrorOr;
using MediatR;

namespace Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuth(this IEndpointRouteBuilder routeBuilder)
    {
        var group = routeBuilder
            .MapGroup("users")
            .WithTags("Users");

        group.MapPost("register", async (RegisterCommand command, ISender sender) =>
        {
            var result = await sender.Send(command);
            return result.Match(Results.Ok, Problem);
        });

        group.MapPost("login", async (LoginCommand command, ISender sender) =>
        {
            var result = await sender.Send(command);
            return result.Match(Results.Ok, Problem);
        });
    }

    private static IResult Problem(List<Error> errors)
    {
        var error = errors.First();
        return error.Type switch
        {
            ErrorType.Validation => Results.BadRequest(error),
            ErrorType.NotFound => Results.NotFound(error),
            ErrorType.Unauthorized => Results.Unauthorized(),
            _ => Results.Problem(error.Description),
        };
    }
}