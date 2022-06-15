using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class ProductsController : BaseApiController
    {
        private readonly InventoryContext _context;
        private readonly IMapper _mapper;
        public ProductsController(InventoryContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto productDto)
        {
            var user = await _context.Users
                            .Include(u => u.Categories)
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
  
            var category = await _context.Categories.Where(u => u.UserId == user.Id).FirstOrDefaultAsync(c => c.Id == productDto.CategoryId);

            if (category == null) return NotFound();

            var product = new Product {
                Name = productDto.Name,
                TotalPrice = productDto.TotalPrice,
                Date = productDto.Date,
                Quantity = productDto.Quantity,
                Unit = productDto.Unit,
                CategoryId = category.Id,
                UserId = user.Id
            };
            _context.Products.Add(product);
            // var product = _mapper.Map<Product>(productDto);
            // _context.Products.Add(product);
            var result = await _context.SaveChangesAsync() > 0;
            if (result) {
                // product.Id = 
                // var prod = _mapper.Map<ProductDto>(product);
                var prod = new ProductDto 
                {
                    Id = product.Id,
                    Name = product.Name,
                    Date = product.Date,
                    TotalPrice = product.TotalPrice,
                    PricePerUnit = product.GetPricePerUnit(),
                    Quantity = product.Quantity,
                    CategoryName = product.Category == null ? null : product.Category.CategoryName,
                    Unit = product.Unit.ToString()
                };
                // return CreatedAtRoute("GetProduct", new {Id = product.Id}, prod);
                return Ok(prod);
            }

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetProducts()
        {
            // var user = await _context.Users
            //                 .Include(a => a.Products)
            //                 .ThenInclude(a => a.Category)
            //                 .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var user = await _context.Users
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

            var products = await _context.Products.Include(p => p.Category).Where(p => p.UserId == user.Id).ToListAsync();
                     
            return products.Select(p => new ProductDto 
            {
                Id = p.Id,
                Name = p.Name,
                Date = p.Date,
                TotalPrice = p.TotalPrice,
                PricePerUnit = p.GetPricePerUnit(),
                Quantity = p.Quantity,
                CategoryName = p.Category == null ? null : p.Category.CategoryName,
                Unit = p.Unit.ToString()
            }).ToList();
        }
        [HttpGet("{id}", Name="GetProduct")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var user = await _context.Users
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var product = await _context.Products.Include(p => p.Category).Where(p => p.UserId == user.Id).FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            return new ProductDto 
            {
                Id = product.Id,
                Name = product.Name,
                Date = product.Date,
                TotalPrice = product.TotalPrice,
                PricePerUnit = product.GetPricePerUnit(),
                Quantity = product.Quantity,
                CategoryName = product.Category == null ? null : product.Category.CategoryName,
                Unit = product.Unit.ToString()
            };
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveProduct(int id)
        {
            var user = await _context.Users
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var product = await _context.Products.Where(p => p.UserId == user.Id).FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return StatusCode(201);
            return BadRequest(new ProblemDetails{Title = "Problem removing item from a user"});
        }
        [HttpPut]
        public async Task<ActionResult<ProductDto>> UpdateProduct(UpdateProductDto productDto)
        {
            var user = await _context.Users
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

            var product = await _context.Products.Where(p => p.UserId == user.Id).FirstOrDefaultAsync(p => p.Id == productDto.Id);

            if (product == null) return NotFound();

            product.Name = productDto.Name;
            product.CategoryId = productDto.CategoryId;
            product.Quantity = productDto.Quantity;
            product.Unit = productDto.Unit;
            product.Date = productDto.Date;
            product.TotalPrice = productDto.TotalPrice;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(productDto);

            return BadRequest(new ProblemDetails{ Title = "Problem updating product"});
        }
        
    }
}