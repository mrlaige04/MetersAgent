using Domain.Abstractions;
using Domain.Users;

namespace Domain.Chatting;

public class Chat : BaseEntity
{
    public string Title { get; set; } = null!;
    public User User { get; set; } = null!;
    public int UserId { get; set; }

    public ICollection<Message> Messages { get; set; } = [];
}