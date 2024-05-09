using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class MessageHub : Hub
{
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IHubContext<PresenceHub> _presenceHub;

    public MessageHub(IUserRepository userRepository, IMessageRepository messageRepository, IHubContext<PresenceHub> presenceHub)
    {
        _userRepository = userRepository;
        _messageRepository = messageRepository;
        _presenceHub = presenceHub;
    }

    public override async Task OnConnectedAsync()
    {
        var thisUsername = Context.User.GetUsername();
        var otherUsername = Context.GetHttpContext().Request.Query["user"];
        var groupName = GetGroupName(thisUsername, otherUsername);

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        var _ = await AddToGroup(groupName) ?? throw new HubException("Unable to add to group");

        var (messages, apiMessages) = await _messageRepository.GetMessageThreadAsync(thisUsername, otherUsername);
        await Clients.Caller.SendAsync("ReceiveMessageThread", messages);

        var readMessages = await _messageRepository.SetMessagesAsReadAsync(apiMessages, thisUsername)
            ?? throw new HubException("Unable to set messages as read");

        if (readMessages.ToList().Count > 0) await Clients.Group(groupName).SendAsync("MessagesRead", readMessages);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var _ = await RemoveFromMessageGroup() ?? throw new HubException("Unable to remove from group");
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var username = Context.User.GetUsername();
        if (username.ToLower() == createMessageDto.RecipientUsername.ToLower())
            throw new HubException("Unable to send auto messages");

        var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
        if (recipient == null) throw new HubException("Recipient not found");

        var sender = await _userRepository.GetUserByUsernameAsync(username);
        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content,
        };

        var groupName = GetGroupName(username, recipient.UserName);
        var group = await _messageRepository.GetMessageGroupAsync(groupName);
        if (group.Connections.Any(c => c.Username == recipient.UserName)) message.DateRead = DateTime.UtcNow;
        else
        {
            var presenceConnection = await PresenceTracker.GetConnectionsForUser(recipient.UserName);
            if (presenceConnection != null) await _presenceHub.Clients.Clients(presenceConnection).SendAsync(
                    "NewMessageReceived",
                    new { username, knownAs = sender.KnownAs }
                );
        }

        var messageDto = await _messageRepository.AddMessageAsync(message);
        if (messageDto == null) throw new HubException("Unable to send message");

        await Clients.Group(groupName).SendAsync("NewMessage", messageDto);
    }

    private string GetGroupName(string caller, string other)
    {
        return string.CompareOrdinal(caller, other) < 0 ?
            $"{caller}-{other}" : $"{other}-{caller}";
    }

    // should be implemeted using Redis
    private async Task<Group> AddToGroup(string groupName)
    {
        var group = await _messageRepository.GetMessageGroupAsync(groupName);
        group ??= await _messageRepository.AddGroupAsync(groupName);
        var connection = await _messageRepository.AddConnectionAsync(group, Context.ConnectionId, Context.User.GetUsername());
        return connection != null ? group : null;
    }

    // should be implemeted using Redis
    private async Task<Group> RemoveFromMessageGroup()
    {
        var group = await _messageRepository.GetMessageGroupForConnectionAsync(Context.ConnectionId);
        var connection = group.Connections.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);
        return await _messageRepository.RemoveConectionAsync(connection) != null ? group : null;
    }
}
