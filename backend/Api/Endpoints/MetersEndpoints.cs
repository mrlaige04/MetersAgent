using Application.Meters.CreateMeter;
using Application.Meters.GetMeters;
using ErrorOr;
using MediatR;

namespace Api.Endpoints;

public static class MetersEndpoints
{
    public static void MapMeters(this IEndpointRouteBuilder routeBuilder)
    {
        var group = routeBuilder
            .MapGroup("meters")
            .WithTags("Meters");

        group.MapGet("", async ([AsParameters] GetMetersQuery query, ISender sender) =>
        {
            var result = await sender.Send(query);
            return result.Match(Results.Ok, Problem);
        });

        group.MapPost("", async (CreateMeterCommand command, ISender sender) =>
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