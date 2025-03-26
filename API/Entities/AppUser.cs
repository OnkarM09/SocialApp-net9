using API.Extensions;
using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class AppUser
{
    [Key]
    public int Id { get; set; }
    public required string UserName { get; set; } = "";
    public byte[] PasswordHash { get; set; } = [];
    public  byte[] PasswordSalt { get; set; } = [];
    public DateOnly DateOfBirth { get; set; }
    public required string KnownAs { get; set; }
    public DateTime Createdd { get; set; }
    public DateTime LastActive { get; set; }
    public required string Gender { get; set; }
    public string? Introduction { get; set; }
    public string? Interests { get; set; }
    public string? LookingFor { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }
    public List<Photo> Photos { get; set; } = [];
    public List<UserLike> LikedByUsers { get; set; } = [];
    public List<UserLike> LikedUsers { get; set; } = [];
}