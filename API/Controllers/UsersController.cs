using API.Data;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _repository;
    private readonly IPhotoService _photoService;
    private readonly IPhotoRepository _photoRepository;

    public UsersController(IUserRepository repository, IPhotoService photoService, IPhotoRepository photoRepository)
    {
        _repository = repository;
        _photoService = photoService;
        _photoRepository = photoRepository;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
    {
        userParams.CurrentUsername = User.GetUsername();
        var userGender = await _repository.GetUserGenderByUsernameAsync(userParams.CurrentUsername);
        if (userGender == null) return NotFound();

        userParams.Gender ??= userGender == "male" ? "female" : "male";
        var users = await _repository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(
            new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages)
        );
        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var isCurrentUser = username.ToLower() == User.GetUsername().ToLower();
        return await _repository.GetMemberByUsernameAsync(username, isCurrentUser);
    }

    [HttpPut]
    public async Task<ActionResult<MemberDto>> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var user = await _repository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var updatedMember = await _repository.UpdateMemberAsync(user, memberUpdateDto);
        if (updatedMember == null) return BadRequest();

        return updatedMember;
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await _repository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var result = await _photoService.AddPhotoAsync(file);
        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = await _repository.AddPhotoAsync(
            user,
            result.SecureUrl.AbsoluteUri,
            result.PublicId
        );
        if (photo == null) return BadRequest(photo);

        return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, photo);
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await _repository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var newMainPhoto = _repository.GetPhotoById(user, photoId); // photo needs to be approved
        if (newMainPhoto == null) return NotFound();
        if (newMainPhoto.IsMain) return BadRequest("Photo is already main");

        var updatedPhoto = await _repository.SetMainPhotoAsync(user, newMainPhoto);
        if (updatedPhoto == null) return BadRequest("Cannot set photo as main");

        return NoContent();
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await _repository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var photo = await _photoRepository.GetPhotoByIdAsync(photoId); // include awaiting approval photos
        if (photo == null) return NotFound();
        if (photo.IsMain) return BadRequest("Photo is main");

        if (photo.PublicId != null) // not seeded
        {
            var result = await _photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }

        var deletedPhoto = await _repository.DeletePhotoAsync(user, photo);
        if (deletedPhoto == null) return BadRequest("Cannot delete photo");

        return Ok();
    }
}
