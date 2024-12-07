using Application.Abstractions;
using Application.Chats.Models;
using Domain.Chatting;
using ErrorOr;

namespace Application.Chats.GetChat;

public class GetChatHandler(IChatRepository chatRepository, ICurrentUser currentUser) : ICommandHandler<GetChatQuery, ChatResponse>
{
    public async Task<ErrorOr<ChatResponse>> Handle(GetChatQuery request, CancellationToken cancellationToken)
    {
        var userIdStr = currentUser.UserId;
        if (!int.TryParse(userIdStr, out var userId))
            return Error.Unauthorized();
        
        var chat = await chatRepository.GetByIdAsync(request.Id, cancellationToken);
        if (chat is null)
            return Error.NotFound("Chat.NotFound", "Chat not found");
        if (chat.UserId != userId)
            return Error.Forbidden("Chat.NoAccess", "You do not have access to this chat");

        return new ChatResponse
        {
            Id = chat.Id,
            Title = chat.Title,
            Messages = chat.Messages.Select(m => new MessageResponse
            {
                ChatId = chat.Id,
                Id = m.Id,
                ContentHtml = m.ContentHtml,
                IsSystem = m.IsSystem,
            }).ToList()
        };
    }
}