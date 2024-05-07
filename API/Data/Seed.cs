using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;
//using System.Text;
using System.Text.Json;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)// (DataContext context)
    {
        //if (await context.Users.AnyAsync()) return;
        if (await userManager.Users.AnyAsync()) return;

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

        var roles = new List<AppRole> {
            new() { Name = "Member" },
            new() { Name = "Admin" },
            new() { Name = "Moderator" }
        };
        roles.ForEach(async role => await roleManager.CreateAsync(role));

        foreach ( var user in users )
        {
            //using var hmac = new HMACSHA512();
            //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            //user.PasswordSalt = hmac.Key;
            //context.Users.Add(user);
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }
        //await context.SaveChangesAsync();

        var admin = new AppUser { UserName = "admin" };
        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
    }
}
