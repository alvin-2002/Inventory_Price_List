using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
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
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole{Name = "Member", NormalizedName = "MEMBER"}
                );
        }
    }
}