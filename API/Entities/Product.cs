using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public long TotalPrice { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public long Quantity { get; set; }
        public Unit Unit { get; set; }
        public long GetPricePerUnit()
        {
            return TotalPrice / Quantity;
        }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}