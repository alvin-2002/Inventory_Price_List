using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class InventoryContext : IdentityDbContext<User>
    {
        public InventoryContext(DbContextOptions options) : base(options)
        {

        }
        // public DbSet<> MyProperty { get; set; }
    }
}