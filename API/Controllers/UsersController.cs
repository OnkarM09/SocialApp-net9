using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService) : CustomBaseController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        IEnumerable<MemberDto> users = await userRepository.GetMembersAsync();
        return Ok(users);
    }

    // [HttpGet("{id:int}")]
    // public async Task<ActionResult<AppUser>> GetUser(int id)
    // {

    //     AppUser? user = await userRepository.GetUserByIdAsync(id);
    //     if (user == null)
    //     {
    //         return NotFound();
    //     }
    //     return Ok(user);
    // }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        MemberDto? user = await userRepository.GetMemberAsync(username);
        return Ok(user);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberDto memberUpdateDto)
    {

        AppUser? user = await userRepository.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return BadRequest("User not found!");

        //mapper.Map(memberUpdateDto, user);
        user.Interests = memberUpdateDto.Interests;
        user.LookingFor = memberUpdateDto.LookingFor;
        user.Introduction = memberUpdateDto.Introduction;
        user.City = memberUpdateDto.City;
        user.Country = memberUpdateDto.Country;
        userRepository.Update(user);

        if (await userRepository.SaveAllAsync()) return NoContent();

        return StatusCode(500, "Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await userRepository.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return BadRequest("User not found!");
        var result = await photoService.AddPhotoAsync(file);
        if (result.Error != null) return BadRequest(result.Error.Message);
        Photo photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };
        user.Photos.Add(photo);
        if (await userRepository.SaveAllAsync()) return CreatedAtAction(nameof(GetUser),
             new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
        //Instead of sending 200 OK which we preivously did, we are now sending 201 CreatedAtAction            
        return BadRequest("Problem while adding photo");
    }

}