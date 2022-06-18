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
    public class InventoryContext : DbContext
    {
        public InventoryContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Shop> Shops { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // builder.Entity<Product>()
            //     .HasOne(p => p.User)
            //     .WithMany(u => u.Products)
            //     .HasForeignKey(n => n.UserId)
            //     .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<User>()
                .HasMany(c => c.Categories)
                .WithOne()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<User>()
                .HasMany(s => s.Categories)
                .WithOne()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // builder.Entity<Role>()
            //     .HasData(
            //         new Role{Id = 1, Name = "Member", NormalizedName = "MEMBER"}
            //     );
        }
    }
}