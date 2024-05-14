using API.DTOs;
using API.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public interface IPhotoRepository
{
    Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos();
    Task<Photo> GetPhotoByIdAsync(int photoId);
    Task<PhotoDto> ApprovePhotoAsync(Photo photo);
    Task<PhotoDto> DeletePhotoAsync(Photo photo);
}

public class PhotoRepository : BaseRepository, IPhotoRepository
{
    private readonly IMapper _mapper;

    public PhotoRepository(DataContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }

    public async Task<IEnumerable<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await _context.Photos
            .IgnoreQueryFilters()
            .Where(p => !p.IsApproved)
            .ProjectTo<PhotoForApprovalDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<Photo> GetPhotoByIdAsync(int photoId)
    {
        return await _context.Photos
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(p => p.Id == photoId);
    }

    public async Task<PhotoDto> ApprovePhotoAsync(Photo photo)
    {
        photo.IsApproved = true;
        var userHasMainPhoto = await _context.Photos
            .AnyAsync(p => p.AppUserId == photo.AppUserId && p.IsMain);
        if (!userHasMainPhoto) photo.IsMain = true;
        return await SaveAll(photo, m => _mapper.Map<PhotoDto>(photo));
    }

    public async Task<PhotoDto> DeletePhotoAsync(Photo photo)
    {
        _context.Photos.Remove(photo);
        return await SaveAll(photo, m => _mapper.Map<PhotoDto>(photo));
    }
}
