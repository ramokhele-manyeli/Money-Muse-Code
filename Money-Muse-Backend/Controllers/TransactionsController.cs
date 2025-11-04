using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Money_Muse_Backend.DTOs;
using Money_Muse_Backend.Interfaces;
using System;
using System.Threading.Tasks;

namespace Money_Muse_Backend.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;

        public TransactionsController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        // GET /api/transactions?filter=...&sort=...&page=...&pageSize=...
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] TransactionQueryDto query)
        {
            var result = await _transactionService.GetAllAsync(query, User);
            return Ok(result);
        }

        // GET /api/transactions/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _transactionService.GetByIdAsync(id, User);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST /api/transactions
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TransactionCreateDto dto)
        {
            var created = await _transactionService.CreateAsync(dto, User);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT /api/transactions/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] TransactionUpdateDto dto)
        {
            var updated = await _transactionService.UpdateAsync(id, dto, User);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE /api/transactions/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _transactionService.DeleteAsync(id, User);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // POST /api/transactions/bulk
        [HttpPost("bulk")]
        public async Task<IActionResult> BulkCreate([FromBody] TransactionBulkCreateDto dto)
        {
            var created = await _transactionService.BulkCreateAsync(dto, User);
            return Ok(created);
        }

        // POST /api/transactions/{id}/receipt
        [HttpPost("{id:guid}/receipt")]
        public async Task<IActionResult> UploadReceipt(Guid id, [FromForm] UploadReceiptDto dto)
        {
            var url = await _transactionService.UploadReceiptAsync(id, dto.File, User);
            return Ok(new { url });
        }

        // GET /api/transactions/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] TransactionSummaryQueryDto query)
        {
            var summary = await _transactionService.GetSummaryAsync(query, User);
            return Ok(summary);
        }

        // GET /api/transactions/trends
        [HttpGet("trends")]
        public async Task<IActionResult> GetTrends([FromQuery] TransactionTrendsQueryDto query)
        {
            var trends = await _transactionService.GetTrendsAsync(query, User);
            return Ok(trends);
        }
    }
}