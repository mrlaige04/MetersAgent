using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Application.Authentication.Models;

public class JwtOptions
{
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string SecurityKey { get; set; } = null!;

    public TokenValidationParameters ToTokenValidationParameters()
    {
        return new TokenValidationParameters
        {
            NameClaimType = "sub",
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5),
            ValidateIssuerSigningKey = true,
            ValidIssuer = Issuer,
            ValidAudience = Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecurityKey))
        };
    }
}