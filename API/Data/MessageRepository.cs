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
    Task<IEnumerable<MessageDto>> SetMessagesAsReadAsync(string currentUserName, string recipientUserName);
    Task<Group> AddGroupAsync(string groupName);
    Task<Connection> AddConnectionAsync(Group group, string connectionId, string currentUserName);
    Task<Connection> RemoveConectionAsync(Connection conection);
    Task<Connection> GetConnectionAsync(string connectionId);
    Task<Group> GetMessageGroupAsync(string groupName);
    Task<Group> GetMessageGroupForConnectionAsync(string connectionId);

}

public class MessageRepository : BaseRepository, IMessageRepository
{
    private readonly IMapper _mapper;

    public MessageRepository(DataContext context, IMapper mapper) : base(context)
    {
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
        return await GetMessageThreadQuery(currentUserName, recipientUserName)
            .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<IEnumerable<MessageDto>> SetMessagesAsReadAsync(string currentUserName, string recipientUserName)
    {
        var unreadMessages = GetMessageThreadQuery(currentUserName, recipientUserName)
            .Where(m => m.DateRead == null && m.RecipientUsername == currentUserName)
            .Include(m => m.Sender).ThenInclude(r => r.Photos)
            .ToList();

        Func<IEnumerable<Message>, IEnumerable<MessageDto>> mapFn = m => _mapper.Map<IEnumerable<MessageDto>>(m);
        if (!unreadMessages.Any()) return mapFn(unreadMessages);

        foreach (var message in unreadMessages)
        {
            message.DateRead = DateTime.UtcNow;
        }
        return await SaveAll(unreadMessages, mapFn);
    }

    private IQueryable<Message> GetMessageThreadQuery(string currentUserName, string recipientUserName)
    {
        return _context.Messages
            .Where(
                m =>
                    m.RecipientUsername == currentUserName && m.SenderUsername == recipientUserName ||
                    m.RecipientUsername == recipientUserName && m.SenderUsername == currentUserName && !m.SenderDeleted
            )
            .OrderBy(m => m.MessageSent)
            .AsQueryable();
    }

    public async Task<Group> AddGroupAsync(string groupName)
    {
        var group = new Group(groupName);
        group = _context.Groups.Add(group).Entity;
        return await SaveAll(group);
    }

    public async Task<Connection> AddConnectionAsync(Group group, string connectionId, string currentUserName) {
        var connection = new Connection(connectionId, currentUserName);
        group.Connections.Add(connection);
        return await SaveAll(connection);
    }

    public async Task<Connection> RemoveConectionAsync(Connection conection)
    {
        var connection = _context.Remove(conection).Entity;
        return await SaveAll(connection);
    }

    public async Task<Connection> GetConnectionAsync(string connectionId)
    {
        return await _context.Connections.FindAsync(connectionId);
    }

    public async Task<Group> GetMessageGroupAsync(string groupName)
    {
        return await _context.Groups
            .Include(g => g.Connections)
            .FirstOrDefaultAsync(g => g.Name == groupName);
    }

    public async Task<Group> GetMessageGroupForConnectionAsync(string connectionId)
    {
        return await _context.Groups
            .Include(g => g.Connections)
            .Where(g => g.Connections.Any(c => c.ConnectionId == connectionId))
            .FirstOrDefaultAsync();
    }
}
