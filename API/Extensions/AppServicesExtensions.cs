using API.Data;
using API.Services;

namespace API.Extensions;

public static class AppServicesExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        return services;
    }
}
