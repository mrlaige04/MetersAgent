namespace Application.Abstractions;

public interface ICurrentUser
{
    string? UserId { get; }
}