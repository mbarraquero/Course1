using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController :  BaseApiController
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IPhotoRepository _photoRepository;

    public AdminController(UserManager<AppUser> userManager, IPhotoRepository photoRepository)
    {
        _userManager = userManager;
        _photoRepository = photoRepository;
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await _userManager.Users
            .OrderBy(u => u.UserName)
            .Select(u => new
            {
                u.Id,
                Username = u.UserName,
                Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
            })
            .ToListAsync();
        return Ok(users);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, [FromQuery]string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("No roles provided");

        var user = await _userManager.FindByNameAsync(username);
        if (user == null) return NotFound();

        var rolesArr = roles.Split(',').ToArray();
        var userRoles = await _userManager.GetRolesAsync(user);

        var result = await _userManager.AddToRolesAsync(user, rolesArr.Except(userRoles));
        if (!result.Succeeded) return BadRequest("Unable to add new roles");

        result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(rolesArr));
        if (!result.Succeeded) return BadRequest("Unable to remove unused roles");

        return Ok(await _userManager.GetRolesAsync(user));
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public async Task<ActionResult> GetPhotosForModeration()
    {
        return Ok(await _photoRepository.GetUnapprovedPhotos());
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPut("approve-photo/{photoId}")]
    public async Task<ActionResult> ApprovePhoto(int photoId)
    {
        var photo = await _photoRepository.GetPhotoByIdAsync(photoId);
        if (photo == null) return NotFound();

        var result = await _photoRepository.ApprovePhotoAsync(photo);
        if (result == null) return BadRequest("Unable to approve photo");

        return Ok(result);
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpDelete("remove-photo/{photoId}")]
    public async Task<ActionResult> RemovePhoto(int photoId)
    {
        var photo = await _photoRepository.GetPhotoByIdAsync(photoId);
        if (photo == null) return NotFound();

        var result = await _photoRepository.DeletePhotoAsync(photo);
        if (result == null) return BadRequest("Unable to remove photo");

        return Ok(result);
    }
}
