using Application.Abstractions;
using Application.Models;
using Domain.Meters;

namespace Application.Meters.CreateMeter;

public class CreateMeterCommand : ICommand<Success>
{
    public MeterType Type { get; set; }
    public double Value { get; set; }
}