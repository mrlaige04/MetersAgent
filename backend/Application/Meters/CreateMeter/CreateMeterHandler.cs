using Application.Abstractions;
using Domain.Meters;
using ErrorOr;
using Success = Application.Models.Success;

namespace Application.Meters.CreateMeter;

public class CreateMeterHandler(IMeterRepository meterRepository, ICurrentUser currentUser)
    : ICommandHandler<CreateMeterCommand, Success>
{
    public async Task<ErrorOr<Success>> Handle(CreateMeterCommand request, CancellationToken cancellationToken)
    {
        var userIdStr = currentUser.UserId;
        if (!int.TryParse(userIdStr, out var userId))
            return Error.Unauthorized();

        var meter = new Meter
        {
            Type = request.Type,
            Value = request.Value,
            OwnerId = userId,
            Unit = request.Unit,
        };
        
        var createdMeter = await meterRepository.CreateAsync(meter, cancellationToken);
        return new Success(true);
    }
}