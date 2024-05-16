using API.Data;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Middleware;
using API.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

# region DBConnection
string connString;
if (builder.Environment.IsDevelopment())
    connString = builder.Configuration.GetConnectionString("DefaultConnection");
else
{
    // Use connection string provided at runtime by FlyIO
    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    // Parse connection URL to connection string for Npgsql
    connUrl = connUrl.Replace("postgres://", string.Empty);
    var pgUserPass = connUrl.Split("@")[0];
    var pgHostPortDb = connUrl.Split("@")[1];
    var pgHostPort = pgHostPortDb.Split("/")[0];
    var pgDb = pgHostPortDb.Split("/")[1];
    var pgUser = pgUserPass.Split(":")[0];
    var pgPass = pgUserPass.Split(":")[1];
    var pgHost = pgHostPort.Split(":")[0];
    var pgPort = pgHostPort.Split(":")[1];
    var updatedHost = pgHost.Replace("flycast", "internal");

    connString = $"Server={updatedHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
}
builder.Services.AddDbContext<DataContext>(opt =>
{
    // SqLite
    //opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    // Posgres
    opt.UseNpgsql(connString);
});
# endregion

// extension methods
builder.Services.AddSecurityConfig(builder.Configuration);
// IoC
builder.Services.AddServices();
// Automapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
// Cloudinary
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
// Log last active date
builder.Services.AddScoped<LogUserActivity>();
//...
builder.Services.AddSignalR(opt => {
    opt.EnableDetailedErrors = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>(); // custom middleware

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// allow all for local run
app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials() // for SignalR
    .WithOrigins("http://localhost:4200")
);

// use JWT for authorization
app.UseAuthentication();

app.UseAuthorization();

// hosting UI
app.UseDefaultFiles();  // serve wwwroot/index.html
app.UseStaticFiles();   // serve from wwwroot/

app.MapControllers();

// SignalR
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");

// handle any unexpected route
app.MapFallbackToController("Index", "Fallback");

// Seed data
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    //await context.Database.ExecuteSqlRawAsync("DELETE FROM [Connections]"); // Groups implementation not in Redis - Sqlite
    //await context.Database.ExecuteSqlRawAsync("DELETE FROM \"Connections\""); // Groups implementation not in Redis - Posgres
    await Seed.ClearConnections(context); // same than above, no direct DB access
    await Seed.SeedUsers(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();
