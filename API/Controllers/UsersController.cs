﻿using API.Data;
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

    public UsersController(IUserRepository repository, IPhotoService photoService)
    {
        _repository = repository;
        _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
    {
        var user = await _repository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        userParams.CurrentUsername = user.UserName;
        userParams.Gender ??= user.Gender == "male" ? "female" : "male";

        var users = await _repository.GetMembersAsync(userParams);

        Response.AddPaginationHeader(
            new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages)
        );
        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        return await _repository.GetMemberByUsernameAsync(username);
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

        var newMainPhoto = _repository.GetPhotoById(user, photoId);
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

        var photo = _repository.GetPhotoById(user, photoId);
        if (photo == null) return NotFound();
        if (photo.IsMain) return BadRequest("Photo is main");

        if (photo.PublicId != null) // not seeded
        {
            var result = await _photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }

        var deletedPhoto = await _repository.DeletePhoto(user, photo);
        if (deletedPhoto == null) return BadRequest("Cannot delete photo");

        return Ok();
    }
}
