using Application.Abstractions;
using Application.Authentication.Models;
using Application.Authentication.Services;
using Domain.Users;
using ErrorOr;
using Microsoft.AspNetCore.Identity;

namespace Application.Authentication.Register;

public class RegisterHandler(
    UserManager<User> userManager,
    ITokenService tokenService
    )
    : ICommandHandler<RegisterCommand, TokenResponse>
{
    public async Task<ErrorOr<TokenResponse>> Handle(
        RegisterCommand request, 
        CancellationToken cancellationToken)
    {
        var user = new User
        {
            Email = request.Email,
            UserName = request.Email,
        };
        
        var result = await userManager.CreateAsync(user, request.Password);
        if (result.Succeeded) return tokenService.CreateToken(user.Id);

        var errors = result.Errors
            .ToDictionary(e => e.Code, object (e) => e.Description);
        
        return Error.Validation("User.Conflict", "User cannot be created", errors);
    }
}