using Application.Chats.GetChat;

namespace Application.Chats.Models;

public class ChatResponse
{
    public string Title { get; set; } = null!;
    public int Id { get; set; }
    public List<MessageResponse> Messages { get; set; } = [];
}