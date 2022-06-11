using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(InventoryContext context, UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new User
                {
                    UserName = "bob",
                    Email = "bob@test.com"
                };
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
                var user2 = new User
                {
                    UserName = "alvin",
                    Email = "alvin@test.com"
                };
                await userManager.CreateAsync(user2, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user2, "Member");
            }

            // context.SaveChanges();
        }
    }
}