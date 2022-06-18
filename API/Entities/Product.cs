using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime Date { get; set; }
        public decimal Quantity { get; set; }
        
        public Unit Unit { get; set; }
        public decimal GetPricePerUnit()
        {
            return (decimal) TotalPrice / Quantity;
        }

        public int UserId { get; set; }
        public User User { get; set; }
        public int? CategoryId { get; set; }
        public Category Category { get; set; }

        public int? ShopId { get; set; }
        public Shop Shop { get; set; }
    }
}