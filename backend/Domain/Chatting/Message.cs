using Domain.Abstractions;
using Domain.Users;

namespace Domain.Chatting;

public class Message : BaseEntity
{
    public string ContentHtml { get; set; } = string.Empty;

    public Chat Chat { get; set; } = null!;
    public int ChatId { get; set; }
    
    public bool IsSystem { get; set; }
    public User? User { get; set; }
    public int? UserId { get; set; }
}