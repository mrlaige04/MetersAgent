using Domain.Users;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Users;

public class UserRepository(AppDbContext context) : IUserRepository
{
    public async Task<User?> GetByIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await context.Users
            .Include(u => u.Meters)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }
}