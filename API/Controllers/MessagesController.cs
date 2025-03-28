using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Sockets;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController(
        IMessageRepository messageRepository,
        IUserRepository userRepository,
        IMapper mapper) : CustomBaseController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var userName = User.GetUserName();
            if (userName == createMessageDto.RecipientUserName) return BadRequest("You cannot send message to yourself");

            var sender = await userRepository.GetUserByUserNameAsync(userName);
            var recipient = await userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);

            if (sender == null || recipient == null) return BadRequest("Cannot send message at this time");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = userName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            messageRepository.AddMessage(message);
            if (await messageRepository.SaveAllAsync()) return Ok(mapper.Map<MessageDto>(message));
            return StatusCode(500, "Error while adding message! Please try again later.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.UserName = User.GetUserName();
            var messages = await messageRepository.GetMessageForUser(messageParams);
            Response.AddPaginationHeader(messages);
            return messages;
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUserName = User.GetUserName();
            return Ok(await messageRepository.GetMessageThread(currentUserName, username));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var userName = User.GetUserName();
            var message = await messageRepository.GetMessage(id);
            if (message == null) return BadRequest("Can't delete this message");

            if (userName != message.SenderUsername || message.RecipientUsername != userName)
            {
                return Forbid("You are not authorized to deleted this message");
            }
            if (message.SenderUsername == userName) message.SenderDeleted = true;
            if (message.RecipientUsername == userName) message.RecipientDeleted = true;

            if (message is { SenderDeleted: true, RecipientDeleted: true })
            {
                messageRepository.DeleteMessage(message);
            }

            if (await messageRepository.SaveAllAsync()) return Ok();
            return StatusCode(500, "Internal server error while deleting the message");
        }
    }
}
