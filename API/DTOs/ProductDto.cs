using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime Date { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public string CategoryName { get; set; }
        public string ShopName { get; set; }
        public decimal PricePerUnit { get; set; }
        
    }
}