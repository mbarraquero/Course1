using API.DTOs;
using API.Entities;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public interface IUserRepository
{
    Task<AppUser> GetUserByIdNoPhotosAsync(int id);
    Task<AppUser> GetUserByUsernameAsync(string username);
    Task<string> GetUserGenderByUsernameAsync(string username);
    Task<MemberDto> GetMemberByUsernameAsync(string username, bool isCurrentUser = false);
    Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
    Task<AppUser> UpdateUserAsync(AppUser user);
    Task<MemberDto> UpdateMemberAsync(AppUser user, MemberUpdateDto member);
    Task<PhotoDto> AddPhotoAsync(AppUser user, string url, string publicId);
    Photo GetPhotoById(AppUser user, int photoId);
    Task<Photo> SetMainPhotoAsync(AppUser user, Photo newMainPhoto);
    Task<Photo> DeletePhotoAsync(AppUser user, Photo photo);
}

public class UserRepository : BaseRepository, IUserRepository
{
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }

    public async Task<AppUser> GetUserByIdNoPhotosAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(user => user.UserName == username);
    }

    //public async Task<IEnumerable<AppUser>> GetUsersAsync()
    //{
    //    return await _context.Users
    //        .Include(p => p.Photos)
    //        .ToListAsync();
    //}

    public async Task<string> GetUserGenderByUsernameAsync(string username)
    {
        return await _context.Users
            .Where(u => u.UserName == username)
            .Select(u => u.Gender)
            .FirstOrDefaultAsync();
    }

    public async Task<MemberDto> GetMemberByUsernameAsync(string username, bool isCurrentUser = false)
    {
        var query = _context.Users.AsQueryable();
        if (isCurrentUser) query = query.IgnoreQueryFilters(); // include awaiting approval photos
        return await query
            .Where(u => u.UserName.ToLower() == username.ToLower())
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

        var query = _context.Users.AsQueryable()
            .Where(u => u.UserName != userParams.CurrentUsername)
            .Where(u => u.Gender == userParams.Gender)
            .Where(u => u.DateOfBirth >= minDob && u.DateOfBirth < maxDob);

        query = userParams.OrderBy switch
        {
            "created" => query.OrderByDescending(u => u.Created),
            "lastActive" => query.OrderByDescending(u => u.LastActive),
            _ => query.OrderByDescending(u => u.LastActive),
        };

        return await PagedList<MemberDto>.CreateAsync
        (
            query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
            userParams.PageNumber,
            userParams.PageSize
        );
    }

    //public async Task<AppUser> AddUserAsync(AppUser user)
    //{
    //    var savedUser = _context.Users.Add(user).Entity;
    //    return await SaveAll(savedUser);
    //}

    public async Task<AppUser> UpdateUserAsync(AppUser user)
    {
        return await SaveAll(_context.Update(user).Entity);
    }

    public async Task<MemberDto> UpdateMemberAsync(AppUser user, MemberUpdateDto member)
    {
        var updatedUser = _mapper.Map(member, user);
        return await SaveAll(updatedUser, (u) => _mapper.Map<MemberDto>(u));
    }

    //public async Task<IEnumerable<AppUser>> UpdateUsersAsync(IEnumerable<AppUser> users)
    //{
    //    var updatedUsers = users.Select(user => _context.Update(user).Entity).ToList();
    //    return await SaveAll(updatedUsers);
    //}

    public async Task<PhotoDto> AddPhotoAsync(AppUser user, string url, string publicId)
    {
        var photo = new Photo
        {
            Url = url,
            PublicId = publicId
        };
        user.Photos.Add(photo);
        return await SaveAll(photo, (p) => _mapper.Map<PhotoDto>(p));
    }

    public Photo GetPhotoById(AppUser user, int photoId)
    {
        return user.Photos.FirstOrDefault(x => x.Id == photoId);
    }

    public async Task<Photo> SetMainPhotoAsync(AppUser user, Photo newMainPhoto)
    {
        var currentMainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentMainPhoto != null) currentMainPhoto.IsMain = false;
        newMainPhoto.IsMain = true;
        return await SaveAll(newMainPhoto);
    }

    public async Task<Photo> DeletePhotoAsync(AppUser user, Photo photo)
    {
        user.Photos.Remove(photo);
        return await SaveAll(photo);
    }
}
