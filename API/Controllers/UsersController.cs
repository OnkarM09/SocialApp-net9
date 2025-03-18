using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper) : CustomBaseController
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
        var userName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userName == null) return BadRequest("User from not found in token");

        AppUser? user = await userRepository.GetUserByUserNameAsync(userName);
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

}