using Domain.Meters;

namespace Application.Meters;

public class MeterResponse
{
    public int Id { get; set; }
    public MeterType Type { get; set; }
    public double Value { get; set; }
    public DateTime Date { get; set; }
}