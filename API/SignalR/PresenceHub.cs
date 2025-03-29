using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        public override async Task OnConnectedAsync()  //When client connect to this hub
        {
            //When connected, execute (invoke) the following method UserIsOnline
            await Clients.Others.SendAsync("UserIsOnline", Context.User?.GetUserName());
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            //When disconnected, execute (invoke) the following method UserIsOffline
            await Clients.Others.SendAsync("UserIsOffline", Context.User?.GetUserName());
            await base.OnDisconnectedAsync(exception);
        }
    }
}
