using API.Data;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly ILikesRepository _likesRepository;

    public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
    {
        _userRepository = userRepository;
        _likesRepository = likesRepository;
    }

    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        var currentUserId = User.GetUserId();
        var sourceUser = await _likesRepository.GetUserWithLikes(currentUserId);
        if (sourceUser.UserName == username) return BadRequest("Users cannot like themselves");

        var likedUser = await _userRepository.GetUserByUsernameAsync(username);
        if (likedUser == null) return NotFound();

        var existingUserLike = await _likesRepository.GetUserLike(currentUserId, likedUser.Id);
        if (existingUserLike != null) return BadRequest("User already liked");

        var newUserLike = await _likesRepository.AddNewLike(sourceUser, likedUser.Id);
        if (newUserLike == null) return BadRequest($"Unable to like {username}");

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
    {
        var validPredicates = new[] { "liked", "likedBy" };
        if (!validPredicates.Contains(likesParams.Predicate)) return BadRequest($"Invalid predicate: {likesParams.Predicate}");

        likesParams.UserId = User.GetUserId();
        var users = await _likesRepository.GetUserLikes(likesParams);
        Response.AddPaginationHeader(
            new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages)
        );
        return Ok(users);
    }
}
