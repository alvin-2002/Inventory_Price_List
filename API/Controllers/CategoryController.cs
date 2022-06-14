using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class CategoryController : BaseApiController
    {
        private readonly InventoryContext _context;
        public CategoryController(InventoryContext context)
        {
            _context = context;   
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateCategory(string name) {
            var user = await _context.Users
                            .Include(p => p.Categories)
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

            user.Categories.Add(new Category{
                CategoryName = name
            });

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok(name);

            return BadRequest(new ProblemDetails { Title = "Problem creating new category" });
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id) {
            var user = await _context.Users
                            .Include(u => u.Categories)
                            .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var category = user.Categories.FirstOrDefault(c => c.Id == id);
            
            if (category == null) return NotFound();

            user.Categories.Remove(category);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return StatusCode(201);
            return BadRequest(new ProblemDetails{Title = "Problem removing category from a user"});
        }

        [HttpGet]
         public async Task<ActionResult<List<Category>>> GetCategories()
        {
            var user = await _context.Users
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var categories = await _context.Categories.Where(u => u.UserId == user.Id).ToListAsync();
                     
            return Ok(categories);
        }
    }
}