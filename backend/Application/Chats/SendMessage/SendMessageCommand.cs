using Application.Abstractions;
using Application.Chats.Models;

namespace Application.Chats.SendMessage;

public class SendMessageCommand : ICommand<MessageResponse>
{
    public int ChatId { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsSystem { get; set; }
}