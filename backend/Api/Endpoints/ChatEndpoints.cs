using Application.Chats.CreateChat;
using Application.Chats.DeleteChat;
using Application.Chats.DeleteMessage;
using Application.Chats.GetAllChats;
using Application.Chats.GetChat;
using Application.Chats.SendMessage;
using ErrorOr;
using MediatR;

namespace Api.Endpoints;

public static class ChatEndpoints
{
    public static void MapChats(this IEndpointRouteBuilder routeBuilder)
    {
        var group = routeBuilder
            .MapGroup("chats")
            .WithTags("Chats");

        group.MapGet("", async (ISender sender) =>
        {
            var query = new GetAllChatsQuery();
            var result = await sender.Send(query);
            return result.Match(Results.Ok, Problem);
        });

        group.MapGet("{id:int}", async (int id, ISender sender) =>
        {
            var query = new GetChatQuery(id);
            var result = await sender.Send(query);
            return result.Match(Results.Ok, Problem);
        });

        group.MapPost("", async (CreateChatCommand command, ISender sender) =>
        {
            var result = await sender.Send(command);
            return result.Match(Results.Ok, Problem);
        });

        group.MapDelete("{id:int}", async (int id, ISender sender) =>
        {
            var command = new DeleteChatCommand(id);
            var result = await sender.Send(command);
            return result.Match(Results.Ok, Problem);
        });

        group.MapPost("{id:int}/messages", async (int id, SendMessageCommand command, ISender sender) =>
        {
            command.ChatId = id;
            var result = await sender.Send(command);
            return result.Match(Results.Ok, Problem);
        });

        group.MapDelete("{id:int}/messages/{messageId:int}", async (int id, int messageId, ISender sender) =>
        {
            var command = new DeleteMessageCommand(id, messageId);
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