using System;

namespace API.Helpers;

public class UserParams
{
    private const int MaxPageSize = 50;
    public int PageNumber { get; set; } = 1;

    //Default page size if the user doesn't specify
    private int _pageSize = 10;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
    public  string? Gender { get; set; }
    public string? CurrentUserName { get; set; }
    public string? City { get; set; }
    public int Age { get; set; }
    public int MaxAge { get; set; } = 150;
    public int MinAge { get; set; } = 18;

    public string? OrderBy { get; set; } = "lastActive";
}
