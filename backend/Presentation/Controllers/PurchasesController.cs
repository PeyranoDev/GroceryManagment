using Application.Schemas.Purchases;
using Application.Services.Interfaces;
using Domain.Tenancy;
using Infraestructure.Tenancy;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchasesController : ControllerBase
    {
        private readonly IPurchaseService _purchaseService;
        private readonly ITenantProvider _tenantProvider;

        public PurchasesController(IPurchaseService purchaseService, ITenantProvider tenantProvider)
        {
            _purchaseService = purchaseService;
            _tenantProvider = tenantProvider;
        }

        [HttpGet]
        public async Task<IActionResult> GetPurchases()
        {
            try
            {
                var groceryId = _tenantProvider.CurrentGroceryId;
                var purchases = await _purchaseService.GetAllPurchasesAsync(groceryId);
                return Ok(purchases);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPurchase(int id)
        {
            try
            {
                var groceryId = _tenantProvider.CurrentGroceryId;
                var purchase = await _purchaseService.GetPurchaseByIdAsync(id, groceryId);
                return Ok(purchase);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePurchase([FromBody] PurchaseForCreateDto purchaseDto)
        {
            try
            {
                var groceryId = _tenantProvider.CurrentGroceryId;
                var purchase = await _purchaseService.CreatePurchaseAsync(purchaseDto, groceryId);
                return CreatedAtAction(nameof(GetPurchase), new { id = purchase.Id }, purchase);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePurchase(int id, [FromBody] PurchaseForUpdateDto purchaseDto)
        {
            try
            {
                var groceryId = _tenantProvider.CurrentGroceryId;
                var purchase = await _purchaseService.UpdatePurchaseAsync(id, purchaseDto, groceryId);
                return Ok(purchase);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePurchase(int id)
        {
            try
            {
                var groceryId = _tenantProvider.CurrentGroceryId;
                await _purchaseService.DeletePurchaseAsync(id, groceryId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("supplier/{supplier}")]
        public async Task<IActionResult> GetPurchasesBySupplier(string supplier)
        {
            try
            {
                var groceryId = _tenantProvider.CurrentGroceryId;
                var purchases = await _purchaseService.GetPurchasesBySupplierAsync(supplier, groceryId);
                return Ok(purchases);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("date-range")]
        public async Task<IActionResult> GetPurchasesByDateRange(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            try
            {
                var groceryId = _tenantProvider.CurrentGroceryId;
                var purchases = await _purchaseService.GetPurchasesByDateRangeAsync(startDate, endDate, groceryId);
                return Ok(purchases);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
