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
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers;

[Authorize]
public class UsersController(IUnitofWork unitofWork, IMapper mapper, IPhotoService photoService) : CustomBaseController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    {
        userParams.CurrentUserName = User.GetUserName();
        PagedList<MemberDto> users = await unitofWork.UserRepository.GetMembersAsync(userParams);
        Response.AddPaginationHeader(users);
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppUser>> GetUser(int id)
    {

        AppUser? user = await unitofWork.UserRepository.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        MemberDto? user = await unitofWork.UserRepository.GetMemberAsync(username);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberDto memberUpdateDto)
    {

        AppUser? user = await unitofWork.UserRepository.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return BadRequest("User not found!");

        user.Interests = memberUpdateDto.Interests;
        user.LookingFor = memberUpdateDto.LookingFor;
        user.Introduction = memberUpdateDto.Introduction;
        user.City = memberUpdateDto.City!;
        user.Country = memberUpdateDto.Country!;
        unitofWork.UserRepository.Update(user);

        if (await unitofWork.Complete()) return NoContent();

        return StatusCode(500, "Failed to update user");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await unitofWork.UserRepository.GetUserByUserNameAsync(User.GetUserName());
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
        if (await unitofWork.Complete()) return CreatedAtAction(nameof(GetUser),
             new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
        return BadRequest("Problem while adding photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await unitofWork.UserRepository.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return BadRequest("User not found!");
        var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
        if (photo == null || photo.IsMain) return BadRequest("Photo not found or already main photo!");

        var previousMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);
        if (previousMainPhoto != null) previousMainPhoto.IsMain = false;

        photo.IsMain = true;
        if (await unitofWork.Complete()) return NoContent();
        return StatusCode(500, "Failed to set main photo!");
    }


    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await unitofWork.UserRepository.GetUserByUserNameAsync(User.GetUserName());
        if (user == null) return BadRequest("User not found!");
        var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
        if (photo == null) return BadRequest("This photo cannot be deleted");
        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }
        user.Photos.Remove(photo);
        if (await unitofWork.Complete()) return Ok();
        return BadRequest("Failed to delete photo");
    }
}