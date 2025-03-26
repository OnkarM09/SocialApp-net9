using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController(ILikeRepository likesRepository) : CustomBaseController
    {
        [HttpPost("{targetUserId:int}")]
        public async Task<ActionResult> ToggleLike(int targetUserId)
        {
            var sourceUserId = User.GetUserId();
            if (sourceUserId == targetUserId) return BadRequest("Cannot like yourself");

            var existingLike = await likesRepository.GetUserLike(sourceUserId, targetUserId);
         
            if (existingLike == null)
            {
                var like = new UserLike
                {
                    SourceUserId = sourceUserId,
                    TargetUserId = targetUserId,
                };
                likesRepository.AddLike(like);
            }
            else
            {
                likesRepository.DeleteLike(existingLike);
            }
            if (await likesRepository.SaveChanges()) return Ok();
            return StatusCode(500, "Error while updating like");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikesIds()
        {
            return Ok(await likesRepository.GetCurretUserLikeIds(User.GetUserId()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> UserLikes(string predicate)
        {
            var users = await likesRepository.GetUserLikes(predicate, User.GetUserId());
            return Ok(users);
        }
    }
}
