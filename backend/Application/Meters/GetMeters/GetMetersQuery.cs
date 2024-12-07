using Application.Abstractions;
using Domain.Meters;

namespace Application.Meters.GetMeters;

public class GetMetersQuery : ICommand<List<MeterResponse>>
{
    public MeterType Type { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}