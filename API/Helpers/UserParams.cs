using System;

namespace API.Helpers;

public class UserParams : PaginationParams
{
    public  string? Gender { get; set; }
    public string? CurrentUserName { get; set; }
    public string? City { get; set; }

    public string? SearchString { get; set; }
    public int Age { get; set; }
    public int MaxAge { get; set; } = 150;
    public int MinAge { get; set; } = 18;
    public string? OrderBy { get; set; } = "lastActive";
}
