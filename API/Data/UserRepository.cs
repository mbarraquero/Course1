using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public interface IUserRepository
{
    Task<AppUser> GetUserByUsernameAsync(string username);
    Task<MemberDto> GetMemberByUsernameAsync(string username);
    Task<IEnumerable<MemberDto>> GetMembersAsync();
    Task<AppUser> AddUserAsync(AppUser user);
    Task<MemberDto> UpdateMemberAsync(AppUser user, MemberUpdateDto member);
    Task<IEnumerable<AppUser>> UpdateUsersAsync(IEnumerable<AppUser> users);
}

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    //public async Task<AppUser> GetUserByIdAsync(int id)
    //{
    //    return await _context.Users.FindAsync(id);
    //}

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

    public async Task<MemberDto> GetMemberByUsernameAsync(string username)
    {
        return await _context.Users
            .Where(x => x.UserName.ToLower() == username.ToLower())
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        return await _context.Users
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // TODO rest of CRUD with automapper

    public async Task<AppUser> AddUserAsync(AppUser user)
    {
        var savedUser = _context.Users.Add(user).Entity;
        return await SaveAll(savedUser);
    }

    public async Task<MemberDto> UpdateMemberAsync(AppUser user, MemberUpdateDto member)
    {
        var updatedUser = _mapper.Map(member, user);
        return await SaveAll(_mapper.Map<MemberDto>(updatedUser));
    }

    public async Task<IEnumerable<AppUser>> UpdateUsersAsync(IEnumerable<AppUser> users)
    {
        var updatedUsers = users.Select(user => _context.Update(user).Entity).ToList();
        return await SaveAll(updatedUsers);
    }

    private async Task<T> SaveAll<T>(T entity) where T : new()
    {
        var updates = await _context.SaveChangesAsync();
        return updates > 0 ? entity : default;
    }
}
