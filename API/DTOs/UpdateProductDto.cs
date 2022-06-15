using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class UpdateProductDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [Range(0, Double.PositiveInfinity)] // no max value
        public decimal TotalPrice { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        [Range(1, Double.PositiveInfinity)]
        public decimal Quantity { get; set; }
        public int? CategoryId { get; set; }
        public Unit Unit { get; set; }
    }
}