using API.DTOs;
using API.Entities;
using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Data;

public interface IMessageRepository
{
    Task<MessageDto> AddMessageAsync(Message message);
    Task<Message> DeleteMessageAsync(string currentUserName,Message message);
    Task<Message> GetMessageAsync(int id);
    Task<PagedList<MessageDto>> GetMessagesForUserAsync(MessageParams messageParams);
    Task<IEnumerable<MessageDto>> GetMessageThreadAsync(string currentUserName, string recipientUserName);
}

public class MessageRepository : IMessageRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public MessageRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<MessageDto> AddMessageAsync(Message message)
    {
        var newMessage = _context.Messages.Add(message).Entity;
        return await SaveAll(newMessage, (m) => _mapper.Map<MessageDto>(m));
    }

    public async Task<Message> DeleteMessageAsync(string currentUserName, Message message)
    {
        if (message.SenderUsername == currentUserName) message.SenderDeleted = true;
        if (message.RecipientUsername == currentUserName) message.RecipientDeleted = true;
        if (message.SenderDeleted && message.RecipientDeleted)
            message = _context.Messages.Remove(message).Entity;
        return await SaveAll(message);
    }

    public async Task<Message> GetMessageAsync(int id)
    {
        return await _context.Messages.FindAsync(id);
    }

    public async Task<PagedList<MessageDto>> GetMessagesForUserAsync(MessageParams messageParams)
    {
        Expression<Func<Message, bool>> wherePred = messageParams.Container switch
        {
            "Inbox" => m => m.RecipientUsername == messageParams.Username && !m.RecipientDeleted,
            "Outbox" => m => m.SenderUsername == messageParams.Username && !m.SenderDeleted,
            _ => m => m.RecipientUsername == messageParams.Username && !m.RecipientDeleted
                && m.DateRead == null // "Unread"
        };

        var query = _context.Messages
            .OrderByDescending(x => x.MessageSent)
            .Where(wherePred)
            .AsQueryable();
        var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
        return await PagedList<MessageDto>.CreateAsync
        (
            messages,
            messageParams.PageNumber,
            messageParams.PageSize
        );
    }

    public async Task<IEnumerable<MessageDto>> GetMessageThreadAsync(string currentUserName, string recipientUserName)
    {
        var messages = await _context.Messages
            .Include(m => m.Sender).ThenInclude(s => s.Photos)
            .Include(m => m.Recipient).ThenInclude(s => s.Photos)
            .Where(
                m =>
                    m.RecipientUsername == currentUserName && m.SenderUsername == recipientUserName ||
                    m.RecipientUsername == recipientUserName && m.SenderUsername == currentUserName && !m.SenderDeleted
            )
            .OrderBy(m => m.MessageSent)
            .ToListAsync();
        var unreadMessages = messages
            .Where(m => m.DateRead == null && m.RecipientUsername == currentUserName)
            .ToList();

        Func<IEnumerable<Message>, IEnumerable<MessageDto>> mapFn = m => _mapper.Map<IEnumerable<MessageDto>>(m);
        if (!unreadMessages.Any()) return mapFn(messages);

        foreach (var message in unreadMessages)
        {
            message.DateRead = DateTime.Now;
        }
        return await SaveAll(messages, mapFn);
    }

    private async Task<T> SaveAll<T>(T entity) where T : new()
    {
        var updates = await _context.SaveChangesAsync();
        return updates > 0 ? entity : default;
    }

    private async Task<U> SaveAll<T, U>(T entity, Func<T, U> map)
    {
        var updates = await _context.SaveChangesAsync();
        return updates > 0 ? map(entity) : default;
    }
}
