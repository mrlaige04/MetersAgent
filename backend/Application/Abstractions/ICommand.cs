using MediatR;
using ErrorOr;

namespace Application.Abstractions;

public interface ICommand<TResponse> : IRequest<ErrorOr<TResponse>>;