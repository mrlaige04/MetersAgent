namespace Domain.Abstractions;

public abstract class BaseEntity : IAuditableEntity, IEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int Id { get; set; }
}