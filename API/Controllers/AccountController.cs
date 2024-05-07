using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using System.Security.Cryptography;
//using System.Text;

namespace API.Controllers;

[AllowAnonymous]
public class AccountController : BaseApiController
{
    //private readonly DataContext _dataContext;
    private readonly UserManager<AppUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ITokenService _tokenService;

    public AccountController(UserManager<AppUser> userManager, IMapper mapper, ITokenService tokenService)
    {
        _userManager = userManager;
        _mapper = mapper;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("User exists");
        var user = _mapper.Map<AppUser>(registerDto);

        //using var hmac = new HMACSHA512();
        //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        //user.PasswordSalt = hmac.Key;

        //_dataContext.Users.Add(user);
        //await _dataContext.SaveChangesAsync();
        var userResult = await _userManager.CreateAsync(user, registerDto.Password);
        if (!userResult.Succeeded) return BadRequest(userResult.Errors);

        var roleResult = await _userManager.AddToRoleAsync(user, "Member");
        if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

        return new UserDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Token = await _tokenService.GetToken(user),
            Gender = user.Gender,
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        //var user = await _dataContext.Users
        var user = await _userManager.Users
            .Include(user => user.Photos)
            .SingleOrDefaultAsync(user => user.UserName.ToLower() == loginDto.Username.ToLower());
        if (user == null) return Unauthorized("User does not exist");

        //using var hmac = new HMACSHA512(user.PasswordSalt);
        //var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
        //for(var i = 0; i < computedHash.Length; i++)
        //{
        //    if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        //}

        var success = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!success) return Unauthorized("Invalid password");

        return new UserDto
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Token = await _tokenService.GetToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            Gender = user.Gender,
        };
    }

    private async Task<bool> UserExists(string username)
    {
        //return await _dataContext.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
        return await _userManager.Users.AnyAsync(user => user.UserName.ToLower() == username.ToLower());
    }
}
