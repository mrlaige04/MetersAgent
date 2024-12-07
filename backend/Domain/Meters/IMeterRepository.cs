namespace Domain.Meters;

public interface IMeterRepository
{
    Task<List<Meter>> GetAllAsync(MeterType meterType, DateTime? startDate = null, DateTime? endDate = null);
    Task<Meter> CreateAsync(Meter meter, CancellationToken cancellationToken = default);
}