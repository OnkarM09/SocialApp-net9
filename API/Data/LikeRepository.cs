using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikeRepository(DataContext context, IMapper mapper) : ILikeRepository
    {
        public void AddLike(UserLike like)
        {
            context.Likes.Add(like);
        }

        public void DeleteLike(UserLike like)
        {
            context.Likes.Remove(like);
        }

        public async Task<IEnumerable<int>> GetCurretUserLikeIds(int curretUserId)
        {
            return await context.Likes
                .Where(u => u.SourceUserId == curretUserId)
                .Select(u => u.TargetUserId)
                .ToListAsync();
        }

        public async Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await context.Likes.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userId)
        {
            var likes = context.Likes.AsQueryable();

            switch (predicate)
            {
                case "liked":
                    return await likes
                        .Where(u => u.SourceUserId == userId)
                        .Select(x => x.TargetUser)
                        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                        .ToListAsync();
                case "likedBy":
                    return await likes
                       .Where(u => u.TargetUserId == userId)
                       .Select(x => x.SourceUser)
                       .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                       .ToListAsync();
                default:
                    var likeIds = await GetCurretUserLikeIds(userId);
                    return await likes
                        .Where(x => x.SourceUserId == userId && likeIds.Contains(x.SourceUserId))
                        .Select(x => x.SourceUser)
                        .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                       .ToListAsync();
            }
        }

        public async Task<bool> SaveChanges()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
