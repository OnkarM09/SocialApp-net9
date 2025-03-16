using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;
    
    [Required(ErrorMessage ="Password is required")]
    [StringLength(8, MinimumLength = 4, ErrorMessage = "Please length should be minimum 4 and maximum 8")]
    public string Password { get; set; } = string.Empty;
}
