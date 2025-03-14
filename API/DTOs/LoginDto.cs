using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class LoginDto
{
    [Required(ErrorMessage = "Username is required")]
    public required string Username { get; set; }


    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; set; }
}