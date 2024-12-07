namespace Application.Chats.Models;

public class MessageResponse
{
    public int Id { get; set; }
    public int ChatId { get; set; }
    public string ContentHtml { get; set; } = string.Empty;
    public bool IsSystem { get; set; }
}