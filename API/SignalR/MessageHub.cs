using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.SignalR;
using System.Runtime.InteropServices;

namespace API.SignalR
{
    public class MessageHub(MessageRepository messageRepository) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext?.Request.Query["user"];
            if(Context.User == null || string.IsNullOrEmpty(otherUser))
            {
                throw new Exception("Cannot join group");
            }
            var groupName = GetGroupName(Context.User.GetUserName(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            var messages = await messageRepository.GetMessageThread(Context.User.GetUserName(), otherUser!);
            await Clients.Group(groupName).SendAsync("RecievedMessageThread", messages);
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        private string GetGroupName(string caller, string? other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller} -${other}" : $"{other}-{caller}";
        }
    }
}
