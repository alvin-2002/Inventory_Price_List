using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; }
        public long TotalPrice { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public long Quantity { get; set; }
        public Unit Unit { get; set; }
 
    }
}