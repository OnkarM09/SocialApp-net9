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
    public class MessageHub(MessageRepository messageRepository, IUserRepository userRepository, IMapper mapper) : Hub
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

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var userName = Context.User?.GetUserName() ?? throw new Exception("User not found!");
            if (userName == createMessageDto.RecipientUserName) throw new HubException("You cannot message yourself");

            var sender = await userRepository.GetUserByUserNameAsync(userName);
            var recipient = await userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);

            if (sender == null || recipient == null || sender.UserName == null || recipient.UserName == null)  throw new Exception("Cannot send message at this time");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = userName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync()) { 
                var group = GetGroupName(sender.UserName, createMessageDto.RecipientUserName);
                await Clients.Group(group).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
            }
        }

        private string GetGroupName(string caller, string? other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller} -${other}" : $"{other}-{caller}";
        }
    }
}
