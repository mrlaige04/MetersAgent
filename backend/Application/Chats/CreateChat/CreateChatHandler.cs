using Application.Abstractions;
using Application.Chats.Models;
using Domain.Chatting;
using ErrorOr;

namespace Application.Chats.CreateChat;

public class CreateChatHandler(IChatRepository repository, ICurrentUser currentUser)
    : ICommandHandler<CreateChatCommand, ChatLinkResponse>
{
    public async Task<ErrorOr<ChatLinkResponse>> Handle(CreateChatCommand request, CancellationToken cancellationToken)
    {
        var userIdStr = currentUser.UserId;
        if (!int.TryParse(userIdStr, out var userId))
            return Error.Unauthorized();

        var welcomeMessage = new Message
        {
            ContentHtml = "Welcome to the chat!",
            IsSystem = true
        };
        
        var chat = new Chat
        {
            UserId = userId,
            Title = request.Title,
            Messages = [welcomeMessage]
        };
        
        var createdChat = await repository.CreateAsync(chat, cancellationToken);

        return new ChatLinkResponse
        {
            Title = createdChat.Title,
            Id = createdChat.Id
        };
    }
}