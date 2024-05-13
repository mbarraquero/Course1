namespace API.Data;

public abstract class BaseRepository
{
    protected readonly DataContext _context;

    protected BaseRepository(DataContext context)
    {
        _context = context;
    }

    protected async Task<T> SaveAll<T>(T entity) where T : new()
    {
        var updates = await _context.SaveChangesAsync();
        return updates > 0 ? entity : default;
    }

    protected async Task<U> SaveAll<T, U>(T entity, Func<T, U> map)
    {
        var updates = await _context.SaveChangesAsync();
        return updates > 0 ? map(entity) : default;
    }
}
