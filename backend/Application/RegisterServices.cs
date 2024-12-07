using System.Reflection;
using Application.Behaviours;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class RegisterServices
{
    public static void AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        });
    }
}