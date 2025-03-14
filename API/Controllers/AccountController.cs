using System.Security.Cryptography;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController(DataContext context) : CustomBaseController
    {

        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(string username, string password){
            using var hmac = new HMACSHA512();
            AppUser user = new AppUser{
                UserName = username,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)),
                PasswordSalt = hmac.Key
            };

            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return user;
        }
    }
}
