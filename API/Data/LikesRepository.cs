﻿using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public interface ILikesRepository
{
    Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
    Task<AppUser> GetUserWithLikes(int userId);
    Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams);
    Task<UserLike> AddNewLike(AppUser sourceUser, int targetUserId);
}

public class LikesRepository : ILikesRepository
{
    private readonly DataContext _context;

    public LikesRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await _context.Likes.FindAsync(sourceUserId, targetUserId);
    }

    public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
    {
        IQueryable<AppUser> users = null;
        
        if (likesParams.Predicate == "liked")
        {
            users = _context.Likes.AsQueryable()
                .Where(like => like.SourceUserId == likesParams.UserId)
                .Select(like => like.TargetUser);
        }
        if (likesParams.Predicate == "likedBy")
        {
            users = _context.Likes.AsQueryable()
               .Where(like => like.TargetUserId == likesParams.UserId)
               .Select(like => like.SourceUser);
        }

        var likedUsers = users.Select(user => new LikeDto
        {
            Id = user.Id,
            UserName = user.UserName,
            KnownAs = user.KnownAs,
            Age = user.DateOfBirth.CalculateAge(),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
            City = user.City,
        });
        return await PagedList<LikeDto>.CreateAsync
        (
            likedUsers,
            likesParams.PageNumber,
            likesParams.PageSize
        );
    }

    public async Task<AppUser> GetUserWithLikes(int userId)
    {
        return await _context.Users
            .Include(x => x.LikedUsers)
            .FirstOrDefaultAsync(x => x.Id == userId);
    }

    public async Task<UserLike> AddNewLike(AppUser sourceUser, int targetUserId)
    {
        var userLike = new UserLike
        {
            SourceUserId = sourceUser.Id,
            TargetUserId = targetUserId
        };
        sourceUser.LikedUsers.Add(userLike);
        return await SaveAll(userLike);
    }

    private async Task<T> SaveAll<T>(T entity) where T : new()
    {
        var updates = await _context.SaveChangesAsync();
        return updates > 0 ? entity : default;
    }
}
