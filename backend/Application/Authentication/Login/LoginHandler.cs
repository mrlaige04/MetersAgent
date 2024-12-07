using Application.Abstractions;
using Application.Authentication.Models;
using Application.Authentication.Services;
using Domain.Users;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace Application.Authentication.Login;

public class LoginHandler(
    UserManager<User> userManager,
    ITokenService tokenService)
    : ICommandHandler<LoginCommand, TokenResponse>
{
    public async Task<ErrorOr<TokenResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return Error.NotFound("User.NotFound", "User not found");
        
        if (!await userManager.CheckPasswordAsync(user, request.Password))
            return Error.Unauthorized("User.InvalidCredentials", "Invalid credentials");
        
        return tokenService.CreateToken(user.Id);
    }
}