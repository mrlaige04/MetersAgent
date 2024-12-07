using Domain.Meters;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Meters;

public class MeterRepository(AppDbContext context) : IMeterRepository
{
    public async Task<List<Meter>> GetAllAsync(MeterType meterType, DateTime? startDate = null, DateTime? endDate = null)
    {
        /*
         * (startDate.HasValue && (m.CreatedAt >= startDate.Value || m.UpdatedAt >= startDate)) &&
                (endDate.HasValue && (m.CreatedAt <= endDate.Value || m.UpdatedAt <= endDate))
         */
        return await context.Meters
            .Where(m =>
                m.Type == meterType 
                )
            .ToListAsync();
    }

    public async Task<Meter> CreateAsync(Meter meter, CancellationToken cancellationToken = default)
    {
        var entry = await context.Meters.AddAsync(meter, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return entry.Entity;
    }
}