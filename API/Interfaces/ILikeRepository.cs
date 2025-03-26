using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface ILikeRepository
    {
        Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId);
        Task<IEnumerable<MemberDto>> GetUserLikes(string predecate, int userId);
        Task<IEnumerable<int>> GetCurretUserLikeIds(int curretUserId);
        void DeleteLike(UserLike like);
        void AddLike(UserLike like);
        Task<bool> SaveChanges();
    }
}
