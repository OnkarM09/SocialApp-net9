using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Runtime.InteropServices;

namespace API.SignalR
{
    public class MessageHub(IUnitofWork unitofWork, IMapper mapper, IHubContext<PresenceHub> presenceHub) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext?.Request.Query["user"];

            if (Context.User == null || string.IsNullOrEmpty(otherUser))
            {
                throw new Exception("Cannot join group");
            }
            var groupName = GetGroupName(Context.User.GetUserName(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroup(groupName);

            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await unitofWork.MessageRepository.GetMessageThread(Context.User.GetUserName(), otherUser!);

            if (unitofWork.HasChanges()) await unitofWork.Complete();

            await Clients.Caller.SendAsync("RecievedMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await RemoveFromMessageGroup();
            await base.OnDisconnectedAsync(exception);
        }

        public async Task ShowUserTyping(string userName)
        {
            AppUser? user = await unitofWork.UserRepository.GetUserByUserNameAsync(userName);
            if (user == null) throw new Exception("User not found!");
            await Clients.Others.SendAsync("UserIsTyping", user.KnownAs);
        }

        public async Task HideUserTyping()
        {
            await Clients.Others.SendAsync("UserIsNotTyping");
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var userName = Context.User?.GetUserName() ?? throw new Exception("User not found!");

            if (userName == createMessageDto.RecipientUserName.ToLower())
                throw new HubException("You cannot message yourself");

            var sender = await unitofWork.UserRepository.GetUserByUserNameAsync(userName);
            var recipient = await unitofWork.UserRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);

            if (sender == null || recipient == null || sender.UserName == null || recipient.UserName == null)
                throw new Exception("Cannot send message at this time");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);
            var group = await unitofWork.MessageRepository.GetMessageGroup(groupName);

            if (group != null && group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PresenceTracker.GetConnectionForUser(recipient.UserName);
                if (connections != null && connections?.Count != null)
                {
                    await presenceHub.Clients.Clients(connections).SendAsync("NewMessageRecieved", new
                    {
                        username = sender.UserName,
                        knownAs = sender.KnownAs
                    });
                }
            }

            unitofWork.MessageRepository.AddMessage(message);
            if (await unitofWork.Complete())
            {
                await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
            }
        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var username = Context.User?.GetUserName() ?? throw new Exception("Cannot get username");
            var group = await unitofWork.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection { ConnectionId = Context.ConnectionId, Username = username };

            if (group == null)
            {
                group = new Group { Name = groupName };
                unitofWork.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if (await unitofWork.Complete()) return group;

            throw new HubException("Failed to join group");
        }

        private async Task<Group> RemoveFromMessageGroup()
        {
            var group = await unitofWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group?.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (connection != null && group != null)
            {
                unitofWork.MessageRepository.RemoveConnection(connection);
                if (await unitofWork.Complete()) return group;
            }

            throw new Exception("Failed to remove from group");
        }

        private string GetGroupName(string caller, string? other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}