using Application.Abstractions;
using Domain.Chatting;
using ErrorOr;
using Success = Application.Models.Success;

namespace Application.Chats.DeleteChat;

public class DeleteChatHandler(IChatRepository chatRepository, ICurrentUser currentUser)
    : ICommandHandler<DeleteChatCommand, Success>
{
    public async Task<ErrorOr<Success>> Handle(DeleteChatCommand request, CancellationToken cancellationToken)
    {
        var userIdStr = currentUser.UserId;
        if (!int.TryParse(userIdStr, out var userId))
            return Error.Unauthorized();
        
        var chat = await chatRepository.GetByIdAsync(request.Id, cancellationToken);
        if (chat is null)
            return Error.NotFound("Chat.NotFound", "Chat not found");
        if (chat.UserId != userId)
            return Error.Forbidden("Chat.NoAccess", "You do not have access to this chat");
        
        var success = await chatRepository.DeleteAsync(chat, cancellationToken);
        return new Success(success);
    }
}