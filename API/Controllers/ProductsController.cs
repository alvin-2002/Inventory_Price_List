using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class ProductsController : BaseApiController
    {
        private readonly InventoryContext _context;
        public ProductsController(InventoryContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto productDto)
        {
            var user = await _context.Users
                            .Include(a => a.Products)
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            
            user.AddProduct(productDto);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok(productDto);

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetProducts()
        {
            var user = await _context.Users
                            .Include(a => a.Products)
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            // Console.WriteLine(user.);                
            return user.Products.Select(p => new ProductDto 
            {
                Id = p.Id,
                Name = p.Name,
                Date = p.Date,
                TotalPrice = p.TotalPrice,
                PricePerUnit = p.GetPricePerUnit(),
                Quantity = p.Quantity,
                Unit = p.Unit.ToString()
            }).ToList();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveProduct(int id)
        {
            var user = await _context.Users
                            .Include(a => a.Products)
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            user.DeleteProduct(id);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return StatusCode(201);
            return BadRequest(new ProblemDetails{Title = "Problem removing item from a user"});
        }
        
    }
}