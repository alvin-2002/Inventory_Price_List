using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
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
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
  
            var category = await _context.Categories.Where(u => u.UserId == user.Id)
                                        .FirstOrDefaultAsync(c => c.Id ==   productDto.CategoryId);

            var shop = await _context.Shops.Where(u => u.UserId == user.Id)
                                    .FirstOrDefaultAsync(c => c.Id == productDto.ShopId);

            if (category == null && productDto.CategoryId != null) return NotFound();
            if (shop == null && productDto.ShopId != null) return NotFound();

            var categoryId = (category == null) ? null : (int?)category.Id;
            var shopId = (shop == null) ? null : (int?)shop.Id;

            var product = new Product {
                Name = productDto.Name,
                TotalPrice = productDto.TotalPrice,
                Date = productDto.Date,
                Quantity = productDto.Quantity,
                Unit = productDto.Unit,
                CategoryId = categoryId,
                ShopId = shopId,
                UserId = user.Id
            };
            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) {

                var prod = new ProductDto 
                {
                    Id = product.Id,
                    Name = product.Name,
                    Date = product.Date,
                    TotalPrice = product.TotalPrice,
                    PricePerUnit = product.GetPricePerUnit(),
                    Quantity = product.Quantity,
                    CategoryName = product.Category == null ? null : product.Category.CategoryName,
                    ShopName = product.Shop == null ? null : product.Shop.ShopName,
                    Unit = product.Unit.ToString()
                };
                
                return Ok(prod);
            }

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var user = await _context.Users
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

            var products = _context.Products
                                .Include(p => p.Category)
                                .Include(p => p.Shop)
                                .Where(p => p.UserId == user.Id)
                                .Filter(productParams.CategoryId, productParams.ShopId)
                                .Search(productParams.SearchTerm);
                     
            return products.Select(p => new ProductDto 
            {
                Id = p.Id,
                Name = p.Name,
                Date = p.Date,
                TotalPrice = p.TotalPrice,
                PricePerUnit = p.GetPricePerUnit(),
                Quantity = p.Quantity,
                CategoryName = p.Category == null ? null : p.Category.CategoryName,
                ShopName = p.Shop == null ? null : p.Shop.ShopName,
                Unit = p.Unit.ToString()
            }).ToList();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<UpdateProductDto>> GetProduct(int id)
        {
            var user = await _context.Users
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var product = await _context.Products
                                .Include(p => p.Category)
                                .Include(p => p.Shop)
                                .Where(p => p.UserId == user.Id)
                                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound();

            return new UpdateProductDto 
            {
                Id = product.Id,
                Name = product.Name,
                Date = product.Date,
                TotalPrice = product.TotalPrice,
                Quantity = product.Quantity,
                CategoryId = product.CategoryId,
                ShopId = product.ShopId,
                Unit = product.Unit
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

            var product = await _context.Products.Include(u => u.Category).Where(p => p.UserId == user.Id).FirstOrDefaultAsync(p => p.Id == productDto.Id);

            if (product == null) return NotFound();

            var category = await _context.Categories.Where(u => u.UserId == user.Id).FirstOrDefaultAsync(c => c.Id == productDto.CategoryId);

            var shop = await _context.Shops.Where(u => u.UserId == user.Id)
                                .FirstOrDefaultAsync(c => c.Id == productDto.ShopId);

            if (category == null && productDto.CategoryId != null) return NotFound();
            if (shop == null && productDto.ShopId != null) return NotFound();

            var categoryId = (category == null) ? null : (int?)category.Id;
            var shopId = (shop == null) ? null : (int?)shop.Id;

            product.Name = productDto.Name;
            product.CategoryId = productDto.CategoryId;
            product.Quantity = productDto.Quantity;
            product.ShopId = productDto.ShopId;
            product.Unit = productDto.Unit;
            product.Date = productDto.Date;
            product.TotalPrice = productDto.TotalPrice;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) {
                // after saving, we get updated product
                var prod = new ProductDto 
                {
                    Id = product.Id,
                    Name = product.Name,
                    Date = product.Date,
                    TotalPrice = product.TotalPrice,
                    PricePerUnit = product.GetPricePerUnit(),
                    Quantity = product.Quantity,
                    CategoryName = product.Category == null ? null : product.Category.CategoryName,
                    ShopName = product.Shop == null ? null : product.Shop.ShopName,
                    Unit = product.Unit.ToString()
                };

                return Ok(prod);
            };

            return BadRequest(new ProblemDetails{ Title = "Problem updating product"});
        }
        
    }
}