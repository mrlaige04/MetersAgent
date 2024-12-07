using Application.Abstractions;
using Application.Authentication.Models;

namespace Application.Authentication.Login;

public class LoginCommand : ICommand<TokenResponse>
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}