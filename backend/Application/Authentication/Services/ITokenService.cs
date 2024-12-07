using Application.Authentication.Models;

namespace Application.Authentication.Services;

public interface ITokenService
{
    TokenResponse CreateToken(int userId);
}