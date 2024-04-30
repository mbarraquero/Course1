namespace API.Helpers;

public class LikesParams : PageParams
{
    public int UserId { get; set; }
    public string Predicate { get; set; }
}
