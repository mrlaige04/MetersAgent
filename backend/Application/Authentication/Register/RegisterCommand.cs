using Application.Abstractions;
using Application.Authentication.Models;

namespace Application.Authentication.Register;

public class RegisterCommand : ICommand<TokenResponse>
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}