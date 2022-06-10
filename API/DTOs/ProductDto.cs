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
        public long TotalPrice { get; set; }
        public DateTime Date { get; set; }
        public long Quantity { get; set; }
        public string Unit { get; set; }
        public long PricePerUnit { get; set; }
        
    }
}