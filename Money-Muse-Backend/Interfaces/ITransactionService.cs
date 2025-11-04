using Money_Muse_Backend.DTOs;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Money_Muse_Backend.Interfaces
{
    public interface ITransactionService
    {
        Task<PaginatedResultDto<TransactionDto>> GetAllAsync(TransactionQueryDto query, ClaimsPrincipal user);
        Task<TransactionDto?> GetByIdAsync(Guid id, ClaimsPrincipal user);
        Task<TransactionDto> CreateAsync(TransactionCreateDto dto, ClaimsPrincipal user);
        Task<TransactionDto?> UpdateAsync(Guid id, TransactionUpdateDto dto, ClaimsPrincipal user);
        Task<bool> DeleteAsync(Guid id, ClaimsPrincipal user);
        Task<BulkCreateResultDto> BulkCreateAsync(TransactionBulkCreateDto dto, ClaimsPrincipal user);
        Task<string> UploadReceiptAsync(Guid id, IFormFile file, ClaimsPrincipal user);
        Task<TransactionSummaryDto> GetSummaryAsync(TransactionSummaryQueryDto query, ClaimsPrincipal user);
        Task<TransactionTrendsDto> GetTrendsAsync(TransactionTrendsQueryDto query, ClaimsPrincipal user);
    }
}