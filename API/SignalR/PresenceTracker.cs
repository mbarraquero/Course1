namespace API.SignalR;

public class PresenceTracker
{
    private static readonly Dictionary<string, List<string>> OnlineUsers = new();

    public Task<bool> UserConnected(string username, string connectionId)
    {
        bool isOnline = false;
        lock (OnlineUsers)
        {
            if (OnlineUsers.ContainsKey(username)) OnlineUsers[username].Add(connectionId);
            else {
                OnlineUsers.Add(username, [connectionId]);
                isOnline = true;
            }
        }
        return Task.FromResult(isOnline);
    }

    public Task<bool> UserDisconnected(string username, string connectionId)
    {
        bool isOffline = false;
        lock (OnlineUsers)
        {
            if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);
            OnlineUsers[username].Remove(connectionId);
            if (OnlineUsers[username].Count == 0) {
                OnlineUsers.Remove(username);
                isOffline = true;
            }
        }
        return Task.FromResult(isOffline);
    }

    public Task<string[]> GetOnlineUsers()
    {
        string[] result;
        lock (OnlineUsers)
        {
            result = OnlineUsers.Select(ou => ou.Key).Order().ToArray();
        }
        return Task.FromResult(result);
    }

    // should be implemeted using Redis
    public static Task<List<string>> GetConnectionsForUser(string username)
    {
        List<string> result;
        lock (OnlineUsers) {
            result = OnlineUsers.GetValueOrDefault(username);
        }
        return Task.FromResult(result);
    }
}
