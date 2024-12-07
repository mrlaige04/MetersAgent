using Application.Abstractions;
using Domain.Meters;
using ErrorOr;

namespace Application.Meters.GetMeters;

public class GetMetersHandler(IMeterRepository meterRepository, ICurrentUser currentUser) : ICommandHandler<GetMetersQuery, List<MeterResponse>>
{
    public async Task<ErrorOr<List<MeterResponse>>> Handle(GetMetersQuery request, CancellationToken cancellationToken)
    {
        var userIdStr = currentUser.UserId;
        if (!int.TryParse(userIdStr, out var userId))
            return Error.Unauthorized();
        
        var meters = await meterRepository.GetAllAsync(request.Type, request.StartDate, request.EndDate);
        var userMeters = meters.Where(m => m.OwnerId == userId);

        return userMeters.Select(m => new MeterResponse
        {
            Id = m.Id,
            Type = m.Type,
            Date = m.UpdatedAt ?? m.CreatedAt,
            Value = m.Value,
        }).ToList();
    }
}