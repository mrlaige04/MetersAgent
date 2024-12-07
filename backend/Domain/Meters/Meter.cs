using Domain.Abstractions;
using Domain.Users;

namespace Domain.Meters;

public class Meter : BaseEntity
{
    public double Value { get; set; }
    public string? Unit { get; set; }

    public MeterType Type { get; set; }
    
    public User Owner { get; set; } = null!;
    public int OwnerId { get; set; }
}