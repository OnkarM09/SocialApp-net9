using System;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public async Task<AppUser?> GetUserByIdAsync(int id)
    {
        return await context.Users
        .FindAsync(id);
    }

    public async Task<AppUser?> GetUserByUserNameAsync(string username)
    {
        return await context.Users
        .Include(x => x.Photos)   //Get photos table also
        .FirstOrDefaultAsync(u => u.UserName == username);
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await context.Users
        .Include(x => x.Photos)
        .ToListAsync();
    }

    public void Update(AppUser user)
    {
        context.Entry(user).State = EntityState.Modified;
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var query = context.Users.AsQueryable();
        query = query.Where(x => x.UserName != userParams.CurrentUserName);

        //Filter Gender
        if (userParams.Gender != null) query = query.Where(u => u.Gender == userParams.Gender);
        //Filter City
        if (userParams.City != null) query = query.Where(u => u.City == userParams.City);

        if (!string.IsNullOrEmpty(userParams.SearchString))
        {
            query = query.Where(user =>
                    user.UserName.ToLower().Contains(userParams.SearchString) ||
                    user.KnownAs.ToLower().Contains(userParams.SearchString));
        }


        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        //Sorting
        query = userParams.OrderBy switch
        {
            "created" => query.OrderBy(x => x.Createdd),
            "age" => query.OrderByDescending(x => x.DateOfBirth),
            "city" => query.OrderBy(x => x.City),
            "country" => query.OrderBy(x => x.Country),
            "name" => query.OrderBy(x => x.KnownAs),
            _ => query.OrderByDescending(x => x.LastActive) //Default sorting case
        };

        return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider),
            userParams.PageNumber, userParams.PageSize);
    }

    public async Task<MemberDto?> GetMemberAsync(string username)
    {
        return await context.Users
               .Where(x => x.UserName == username)
               .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
               .SingleOrDefaultAsync();
    }
}
