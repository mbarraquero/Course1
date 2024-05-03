namespace API.Helpers;

public class MessageParams : PageParams
{
    public string Username { get; set; }
    public string Container { get; set; } = "Unread";
}
