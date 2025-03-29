using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AdminController : CustomBaseController
    {
        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-with-roles")]
        public ActionResult GetUserRoles()
        {
            return Ok("Only admins can see this");
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Only admins or moderators can see this");
        }
    }
}
