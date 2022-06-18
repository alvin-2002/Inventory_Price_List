using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public ICollection<Product> Products { get; set; }
        public ICollection<Shop> Shops { get; set; }
        public ICollection<Category> Categories { get; set; }
    }
}