namespace Domain.Chatting;

public interface IChatRepository
{
    Task<List<Chat>> GetAllAsync(int userId, CancellationToken cancellationToken = default);
    Task<Chat?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Chat> CreateAsync(Chat chat, CancellationToken cancellationToken = default);
    Task<Chat> UpdateAsync(Chat chat, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Chat chat, CancellationToken cancellationToken = default);
}