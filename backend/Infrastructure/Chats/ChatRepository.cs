using Domain.Chatting;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Chats;

public class ChatRepository(AppDbContext context) : IChatRepository
{
    public async Task<List<Chat>> GetAllAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await context.Chats
            .Include(c => c.Messages)
            .Include(c => c.User)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Chat?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await context.Chats
            .Include(c => c.Messages)
            .Include(c => c.User)
            .Where(c => c.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Chat> CreateAsync(Chat chat, CancellationToken cancellationToken = default)
    {
        var entry = await context.Chats.AddAsync(chat, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return entry.Entity;
    }

    public async Task<Chat> UpdateAsync(Chat chat, CancellationToken cancellationToken = default)
    {
        var entry = context.Update(chat);
        await context.SaveChangesAsync(cancellationToken);
        return entry.Entity;
    }

    public async Task<bool> DeleteAsync(Chat chat, CancellationToken cancellationToken = default)
    {
        context.Chats.Remove(chat);
        return await context.SaveChangesAsync(cancellationToken) > 0;
    }
}