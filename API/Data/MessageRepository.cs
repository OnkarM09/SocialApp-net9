using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace API.Data
{
    public class MessageRepository(DataContext context, IMapper mapper) : IMessageRepository
    {
        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Message?> GetMessage(int messageId)
        {
            return await context.Messages.FindAsync(messageId);
        }

        public async Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams)
        {
            var query = context.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.Recipient.UserName == messageParams.UserName && u.RecipientDeleted == false),
                "Outbox" => query.Where(u => u.Sender.UserName == messageParams.UserName && u.SenderDeleted == false),
                _ => query.Where(u => u.Recipient.UserName == messageParams.UserName && u.DateRead == null && u.RecipientDeleted == false)
            };

            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string senderUserName, string recipientUserName)
        {
            var messages = await context.Messages
                 .Include(x => x.Sender).ThenInclude(x => x.Photos)
                 .Include(x => x.Recipient).ThenInclude(x => x.Photos)
                 .Where(
                     x => x.RecipientUsername == senderUserName && x.RecipientDeleted == false && x.SenderUsername == recipientUserName
                     || x.SenderUsername == senderUserName && x.SenderDeleted == false && x.RecipientUsername == recipientUserName)
                 .OrderBy(x => x.MessageSent)
                 .ToListAsync();
            var unreadMessages = messages.Where(x => x.DateRead == null && x.RecipientUsername == senderUserName).ToList();
            if (unreadMessages.Count != 0) {
                unreadMessages.ForEach(x => x.DateRead = DateTime.UtcNow);
                await context.SaveChangesAsync();
            }
            return mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
