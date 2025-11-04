using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Money_Muse_Backend.DTOs;
using Money_Muse_Backend.Interfaces;
using System;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Controllers
{
    [ApiController]
    [Route("api/categories")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET /api/categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetAllAsync(User);
            return Ok(result);
        }

        // GET /api/categories/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _categoryService.GetByIdAsync(id, User);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST /api/categories
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryCreateDto dto)
        {
            var created = await _categoryService.CreateAsync(dto, User);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT /api/categories/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CategoryUpdateDto dto)
        {
            var updated = await _categoryService.UpdateAsync(id, dto, User);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE /api/categories/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _categoryService.DeleteAsync(id, User);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET /api/categories/default
        [HttpGet("default")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDefaults()
        {
            var result = await _categoryService.GetDefaultsAsync();
            return Ok(result);
        }

        // GET /api/categories/user
        [HttpGet("user")]
        public async Task<IActionResult> GetUserCategories()
        {
            var result = await _categoryService.GetUserCategoriesAsync(User);
            return Ok(result);
        }
    }
}