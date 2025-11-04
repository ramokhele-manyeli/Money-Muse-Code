using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Money_Muse_Backend.DTOs;
using Money_Muse_Backend.Interfaces;
using System;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Controllers
{
    [ApiController]
    [Route("api/budgets")]
    [Authorize]
    public class BudgetsController : ControllerBase
    {
        private readonly IBudgetService _budgetService;

        public BudgetsController(IBudgetService budgetService)
        {
            _budgetService = budgetService;
        }

        // GET /api/budgets
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _budgetService.GetAllAsync(User);
            return Ok(result);
        }

        // GET /api/budgets/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _budgetService.GetByIdAsync(id, User);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST /api/budgets
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BudgetCreateDto dto)
        {
            var created = await _budgetService.CreateAsync(dto, User);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT /api/budgets/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] BudgetUpdateDto dto)
        {
            var updated = await _budgetService.UpdateAsync(id, dto, User);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE /api/budgets/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _budgetService.DeleteAsync(id, User);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET /api/budgets/overview
        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview([FromQuery] int month, [FromQuery] int year)
        {
            var overview = await _budgetService.GetOverviewAsync(month, year, User);
            return Ok(overview);
        }

        // GET /api/budgets/{id}/progress
        [HttpGet("{id:guid}/progress")]
        public async Task<IActionResult> GetProgress(Guid id)
        {
            var progress = await _budgetService.GetProgressAsync(id, User);
            if (progress == null) return NotFound();
            return Ok(progress);
        }
    }
}