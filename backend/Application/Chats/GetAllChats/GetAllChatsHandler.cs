using Application.Abstractions;
using Application.Chats.Models;
using Domain.Chatting;
using ErrorOr;

namespace Application.Chats.GetAllChats;

public class GetAllChatsHandler(
    IChatRepository chatRepository,
    ICurrentUser currentUser)
    : ICommandHandler<GetAllChatsQuery, List<ChatLinkResponse>>
{
    public async Task<ErrorOr<List<ChatLinkResponse>>> Handle(GetAllChatsQuery request, CancellationToken cancellationToken)
    {
        var userIdStr = currentUser.UserId;
        if (!int.TryParse(userIdStr, out var userId))
            return Error.Unauthorized();
        
        var chats = await chatRepository.GetAllAsync(userId, cancellationToken);
        
        return chats.Select(c => new ChatLinkResponse
        {
            Title = c.Title,
            Id = c.Id,
        }).ToList();
    }
}