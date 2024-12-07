using Application.Abstractions;
using Domain.Chatting;
using ErrorOr;
using Success = Application.Models.Success;

namespace Application.Chats.DeleteMessage;

public class DeleteMessageHandler(IChatRepository chatRepository, ICurrentUser currentUser)
    : ICommandHandler<DeleteMessageCommand, Success>
{
    public async Task<ErrorOr<Success>> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
    {
        var userIdStr = currentUser.UserId;
        if (!int.TryParse(userIdStr, out var userId))
            return Error.Unauthorized();
        
        var chat = await chatRepository.GetByIdAsync(request.ChatId, cancellationToken);
        if (chat is null)
            return Error.NotFound("Chat.NotFound", "Chat not found");
        if (chat.UserId != userId)
            return Error.Forbidden("Chat.NoAccess", "You do not have access to this chat");
        
        var message = chat.Messages.FirstOrDefault(m => m.Id == request.MessageId);
        if (message is null)
            return Error.NotFound("Message.NotFound", "Message not found");
        
        chat.Messages.Remove(message);
        await chatRepository.UpdateAsync(chat, cancellationToken);

        return new Success(true);
    }
}