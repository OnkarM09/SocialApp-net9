using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper) : CustomBaseController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();

            if (await IsUserExist(registerDto.Username)) return BadRequest("Username already taken");

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest("Cannot create a user");

            return new UserDto
            {
                Username = user.UserName,
                Token =  await tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        private async Task<bool> IsUserExist(string userName)
        {
            return await userManager.Users.AnyAsync(x => x.NormalizedUserName == userName.ToUpper());
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginUser)
        {
            bool isUser = await IsUserExist(loginUser.Username);
            if (isUser)
            {
                AppUser? user = await userManager.Users
                                    .Include(p => p.Photos)
                                        .FirstOrDefaultAsync(x => x.NormalizedUserName == loginUser.Username.ToUpper());

                if (user == null || user.UserName == null) return Unauthorized("Invalid Username");
                var result = await userManager.CheckPasswordAsync(user,loginUser.Password);
                if (!result) return Unauthorized("Password is incorrect");
                //Pass the JWT token
                return new UserDto
                {
                    Username = user.UserName,
                    Token = await tokenService.CreateToken(user),
                    PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                    KnownAs = user.KnownAs,
                    Gender = user.Gender
                };
            }
            return BadRequest("User not found");
        }
    }
}