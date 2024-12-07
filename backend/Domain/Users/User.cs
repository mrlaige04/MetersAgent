using Domain.Chatting;
using Domain.Meters;
using Microsoft.AspNetCore.Identity;

namespace Domain.Users;

public class User : IdentityUser<int>
{
    public ICollection<Chat> Chats { get; set; } = [];
    public ICollection<Meter> Meters { get; set; } = [];
}