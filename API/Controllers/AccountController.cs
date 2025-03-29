using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(DataContext context, ITokenService tokenService, IMapper mapper) : CustomBaseController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            using var hmac = new HMACSHA512();
            var user = mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();

            if (!await IsUserExist(registerDto.Username))
            {
                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();
                return new UserDto
                {
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user),
                    KnownAs = user.KnownAs,
                    Gender = user.Gender
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
                AppUser? user = await context.Users
                                    .Include(p => p.Photos)
                                        .FirstOrDefaultAsync(x => x.UserName.ToLower() == loginUser.Username.ToLower());
               
                //Pass the JWT token
                return new UserDto
                {
                    Username = user.UserName,
                    Token = tokenService.CreateToken(user),
                    PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                    KnownAs = user.KnownAs,
                    Gender = user.Gender
                };
            }
            return BadRequest("User not found");
        }
    }
}