using Application.Schemas.Sales;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Services.Implementations
{
    public class SaleService : ISaleService
    {
        private readonly ISaleRepository _sales;
        private readonly IBaseRepository<SaleItem> _saleItems;
        private readonly IMapper _mapper;

        public SaleService(ISaleRepository sales, IBaseRepository<SaleItem> saleItems, IMapper mapper)
        {
            _sales = sales;
            _saleItems = saleItems;
            _mapper = mapper;
        }

        public async Task<SaleForResponseDto?> GetById(int id)
        {
            var sale = await _sales.GetById(id);
            return sale is null ? null : _mapper.Map<SaleForResponseDto>(sale);
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetAll()
        {
            var list = await _sales.GetAll();
            return list.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            var list = await _sales.GetByDateRange(startDate, endDate);
            return list.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<IReadOnlyList<SaleForResponseDto>> GetByUserId(int userId)
        {
            var list = await _sales.GetByUserId(userId);
            return list.Select(_mapper.Map<SaleForResponseDto>).ToList();
        }

        public async Task<SaleForResponseDto> Create(SaleForCreateDto dto)
        {
            var entity = _mapper.Map<Sale>(dto);
            
            // Calcular el total
            entity.Total = dto.Items.Sum(item => item.Price * item.Quantity);
            entity.Date = DateTime.UtcNow;

            var saleId = await _sales.Create(entity);

            // Crear los items de la venta
            foreach (var itemDto in dto.Items)
            {
                var saleItem = _mapper.Map<SaleItem>(itemDto);
                saleItem.SaleId = saleId;
                await _saleItems.Create(saleItem);
            }

            var created = await _sales.GetById(saleId)!;
            return _mapper.Map<SaleForResponseDto>(created);
        }

        public async Task<bool> Delete(int id)
        {
            var entity = await _sales.GetById(id);
            if (entity is null) return false;
            
            await _sales.Delete(entity);
            await _sales.SaveChanges();
            return true;
        }
    }
}