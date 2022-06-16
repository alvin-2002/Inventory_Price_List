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
    public class CategoryController : BaseApiController
    {
        private readonly InventoryContext _context;
        public CategoryController(InventoryContext context)
        {

            _context = context;   
        }

        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory(AddCategoryDto categoryDto) {
            var user = await _context.Users
                            .Include(p => p.Categories)
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

            var category = new Category {
                CategoryName = categoryDto.CategoryName
            };
            user.Categories.Add(category);

            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok(category);

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
        public async Task<ActionResult<List<CategoryDto>>> GetCategories()
        {
            var user = await _context.Users
                            .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            var categories = await _context.Categories.Where(u => u.UserId == user.Id).ToListAsync();
            var categoriesDto = categories.Select(c => new CategoryDto {
                Id = c.Id,
                CategoryName = c.CategoryName
            }).ToList();
            return Ok(categoriesDto);
        }

        [HttpPut]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(CategoryDto categoryDto)
        {
            var user = await _context.Users
                            .Include(u => u.Categories)
                            .FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

            var category = user.Categories.FirstOrDefault(c => c.Id == categoryDto.Id);
            
            if (category == null) return NotFound();

            category.CategoryName = categoryDto.CategoryName;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(categoryDto);

            return BadRequest(new ProblemDetails{ Title = "Problem updating category"});
        }

     

    }
}