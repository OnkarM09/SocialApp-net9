using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
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
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    {
        userParams.CurrentUserName = User.GetUserName();
        PagedList<MemberDto> users = await userRepository.GetMembersAsync(userParams);
        Response.AddPaginationHeader(users);
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {

        AppUser? user = await userRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

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
        if (user.Photos.Count == 0) photo.IsMain = true;
        user.Photos.Add(photo);
        if (await userRepository.SaveAllAsync()) return CreatedAtAction(nameof(GetUser),
             new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
        return BadRequest("Problem while adding photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await userRepository.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return BadRequest("User not found!");
        var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
        if (photo == null || photo.IsMain) return BadRequest("Photo not found or already main photo!");

        var previousMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);
        if (previousMainPhoto != null) previousMainPhoto.IsMain = false;

        photo.IsMain = true;
        if (await userRepository.SaveAllAsync()) return NoContent();
        return StatusCode(500, "Failed to set main photo!");
    }


    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await userRepository.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return BadRequest("User not found!");
        var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
        if (photo == null) return BadRequest("This photo cannot be deleted");
        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }
        user.Photos.Remove(photo);
        if (await userRepository.SaveAllAsync()) return Ok();
        return BadRequest("Failed to delete photo");
    }
}