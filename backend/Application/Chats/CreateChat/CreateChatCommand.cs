using Application.Abstractions;
using Application.Chats.Models;

namespace Application.Chats.CreateChat;

public class CreateChatCommand : ICommand<ChatLinkResponse>
{
    public string Title { get; set; } = null!;
}