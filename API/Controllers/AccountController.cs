using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(DataContext context, ITokenService tokenService) : CustomBaseController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            using var hmac = new HMACSHA512();
            AppUser user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };
            if (!await IsUserExist(registerDto.Username))
            {
                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();
                return new UserDto
                {
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user)
                };
            }
            return BadRequest("Username already exists");

        }

        private async Task<bool> IsUserExist(string userName)
        {
            return await context.Users.AnyAsync(x => x.UserName.ToLower() == userName.ToLower());
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginUser)
        {
            bool isUser = await IsUserExist(loginUser.Username);
            if (isUser)
            {
                AppUser user = await context.Users.FirstOrDefaultAsync(x => x.UserName.ToLower() == loginUser.Username.ToLower());
                using var hmac = new HMACSHA512(user.PasswordSalt);
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginUser.Password));
                int len = computedHash.Length;
                for (int i = 0; i < len; i++)
                {
                    if (computedHash[i] != user.PasswordHash[i]) return BadRequest("Invalid Password");
                }

                //Pass the JWT token
                return new UserDto
                {
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user)
                };
            }
            return BadRequest("User not found");
        }
    }
}