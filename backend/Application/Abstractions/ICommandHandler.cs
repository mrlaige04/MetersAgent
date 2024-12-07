using MediatR;
using ErrorOr;

namespace Application.Abstractions;

public interface ICommandHandler<in TRequest, TResponse> 
    : IRequestHandler<TRequest, ErrorOr<TResponse>>
    where TRequest : ICommand<TResponse>;