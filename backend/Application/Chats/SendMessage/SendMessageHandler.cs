using Application.Abstractions;
using Application.Chats.Models;
using Domain.Chatting;
using ErrorOr;

namespace Application.Chats.SendMessage;

public class SendMessageHandler(IChatRepository chatRepository, ICurrentUser currentUser)
    : ICommandHandler<SendMessageCommand, MessageResponse>
{
    public async Task<ErrorOr<MessageResponse>> Handle(SendMessageCommand request, CancellationToken cancellationToken)
    {
        var userIdStr = currentUser.UserId;
        if (!int.TryParse(userIdStr, out var userId))
            return Error.Unauthorized();
        
        var chat = await chatRepository.GetByIdAsync(request.ChatId, cancellationToken);
        if (chat is null)
            return Error.NotFound("Chat.NotFound", "Chat not found");
        if (chat.UserId != userId)
            return Error.Forbidden("Chat.NoAccess", "You do not have access to this chat");
        
        var message = new Message
        {
            ChatId = chat.Id,
            ContentHtml = request.Content,
            IsSystem = request.IsSystem,
            UserId = userId
        };
        
        chat.Messages.Add(message);
        
        var updatedChat = await chatRepository.UpdateAsync(chat, cancellationToken);
        var createdMessage = updatedChat.Messages.First(m => m.ContentHtml == request.Content);
        return new MessageResponse
        {
            ChatId = chat.Id,
            ContentHtml = createdMessage.ContentHtml,
            IsSystem = createdMessage.IsSystem,
            Id = createdMessage.Id
        };
    }
}