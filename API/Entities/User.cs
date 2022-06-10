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
        // public Product Product { get; set; }
        public List<Product> Products { get; set; } = new List<Product>();

        public void AddProduct(CreateProductDto productDto){
            Products.Add(new Product {
                Name = productDto.Name,
                TotalPrice = productDto.TotalPrice,
                Quantity = productDto.Quantity,
            });
        }

        public void DeleteProduct(int id) {
            var product = Products.FirstOrDefault(prod => prod.Id == id);
            if (product == null) return;
            Products.Remove(product);
        }
    }
}