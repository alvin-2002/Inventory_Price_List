using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly InventoryContext _context;
        public AccountController(UserManager<User> userManager, TokenService tokenService, InventoryContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);

            if(user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();
            
            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.GenerateToken(user),
                Products = await GetProducts(user.UserName)
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User { UserName= registerDto.Username, Email = registerDto.Email };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            // await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            Console.WriteLine(user.Products);
            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.GenerateToken(user),
                Products = await GetProducts(user.UserName)
            };
        }

        private async Task<List<ProductDto>> GetProducts(String name)
        {
            var user = await _context.Users
                            .Include(a => a.Products)
                            .ThenInclude(a => a.Category)
                            .FirstOrDefaultAsync(x => x.UserName == name);
            // Console.WriteLine(user.);                
            return user.Products.Select(p => new ProductDto 
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
    }
}