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
    public class ShopController : BaseApiController
    {
        private readonly InventoryContext _context;
        public ShopController(InventoryContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ShopDto>> CreateShop(string shopName)
        {
            var user = await _context.Users  
                                .Include(u => u.Shops)
                                .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var shop = new Shop{
                ShopName = shopName
            };

            user.Shops.Add(shop);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(shop);

            return BadRequest(new ProblemDetails { Title = "Problem creating new shop" });
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteShop(int id) {
            var user = await _context.Users
                            .Include(u => u.Shops)
                            .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var shop = user.Shops.FirstOrDefault(s => s.Id == id);
            
            if (shop == null) return NotFound();

            user.Shops.Remove(shop);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return StatusCode(201);
            return BadRequest(new ProblemDetails{Title = "Problem removing shop from a user"});
        }

        [HttpGet]
        public async Task<ActionResult<List<ShopDto>>> GetCategories()
        {
            var user = await _context.Users
                            .Include(u => u.Shops)
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            
            var shopDtos = user.Shops.Select(c => new ShopDto {
                Id = c.Id,
                ShopName = c.ShopName
            }).ToList();

            return Ok(shopDtos);
        }

        [HttpPut]
        public async Task<ActionResult<ShopDto>> UpdateCategory(ShopDto shopDto)
        {
            var user = await _context.Users
                            .Include(u => u.Shops)
                            .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var shop = user.Shops.FirstOrDefault(c => c.Id == shopDto.Id);
            
            if (shop == null) return NotFound();

            shop.ShopName = shopDto.ShopName;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(shopDto);

            return BadRequest(new ProblemDetails{ Title = "Problem updating shop"});
        }

    }
}