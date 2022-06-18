using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Shop
    {
        public int Id { get; set; }
        public string ShopName { get; set; }
        public int UserId { get; set; }
    }
}