using System.ComponentModel.DataAnnotations;

namespace Domain.Abstractions;

public interface IEntity
{
    [Key] public int Id { get; set; }
}