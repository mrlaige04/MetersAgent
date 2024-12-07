using System.IdentityModel.Tokens.Jwt;
using Application.Authentication.Models;
using Application.Authentication.Services;
using Domain.Chatting;
using Domain.Meters;
using Domain.Users;
using Infrastructure.Chats;
using Infrastructure.Database;
using Infrastructure.Meters;
using Infrastructure.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class RegisterServices
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();

        services.AddDbContext<AppDbContext>((sp, opt) =>
        {
            opt.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            opt.UseSqlServer(connectionString);
        });

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IChatRepository, ChatRepository>();
        services.AddScoped<IMeterRepository, MeterRepository>();
        
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));
        var jwtOptions = configuration.GetSection("Jwt").Get<JwtOptions>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = jwtOptions!.ToTokenValidationParameters();
                opt.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                        return Task.CompletedTask;
                    },
                    OnChallenge = context =>
                    {
                        Console.WriteLine($"Challenge error: {context.ErrorDescription}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        Console.WriteLine($"Token validated for user: {context.Principal?.Identity?.Name}");
                        return Task.CompletedTask;
                    }
                };
            });

        services.AddIdentityCore<User>()
            .AddEntityFrameworkStores<AppDbContext>();
        
        services.AddAuthorizationBuilder()
            .AddDefaultPolicy("Bearer", policy =>
            {
                policy.RequireAuthenticatedUser();
            });

        services.AddScoped<ITokenService, TokenService>();
    }
}