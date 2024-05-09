using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepository _messageRepository;

    public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository)
    {
        _userRepository = userRepository;
        _messageRepository = messageRepository;
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var username = User.GetUsername();
        if (username.ToLower() == createMessageDto.RecipientUsername.ToLower())
            return BadRequest("Unable to send auto messages");

        var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
        if (recipient == null) return NotFound();

        var sender = await _userRepository.GetUserByUsernameAsync(username);
        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content,
        };
        var messageDto = await _messageRepository.AddMessageAsync(message);
        if (messageDto == null) return BadRequest("Unable to send message");

        return Ok(messageDto); // should be Created(...);
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MessageDto>>> GetMessagesForUser([FromQuery]MessageParams messageParams)
    {
        var validContainers = new[] { "Inbox", "Outbox", "Unread" };
        if (!validContainers.Contains(messageParams.Container)) return BadRequest($"Invalid container: {messageParams.Container}");

        messageParams.Username = User.GetUsername();
        var messages = await _messageRepository.GetMessagesForUserAsync(messageParams);
        Response.AddPaginationHeader(
            new PaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages)
        );
        return Ok(messages);
    }

    [HttpGet("thread/{username}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
    {
        var currentUserName = User.GetUsername();
        var (thread, apiThread) = await _messageRepository.GetMessageThreadAsync(currentUserName, username);
        await _messageRepository.SetMessagesAsReadAsync(apiThread, currentUserName);
        return Ok(thread);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id)
    {
        var currentUserName = User.GetUsername();
        var message = await _messageRepository.GetMessageAsync(id);
        if (message.SenderUsername != currentUserName && message.RecipientUsername != currentUserName)
            return Unauthorized();

        message = await _messageRepository.DeleteMessageAsync(currentUserName, message);
        if (message == null) return BadRequest("Unable to delete message");

        return Ok();
    }
}
