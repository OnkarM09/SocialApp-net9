using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;
            var username = resultContext.HttpContext.User.GetUserName();
            if (username == null) return;

            //Creating scoped instance of UserRepository services as we are creating it when action
            //filter is being executed
            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
            var user = await repo.GetUserByUserNameAsync(username);
            if (user == null) return;

            user.LastActive = DateTime.UtcNow;
            await repo.SaveAllAsync();
        }
    }
}
