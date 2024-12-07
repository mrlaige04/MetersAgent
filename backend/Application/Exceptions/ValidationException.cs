using FluentValidation.Results;

namespace Application.Exceptions;

public class ValidationException() : Exception("One or more validation failures have occurred.")
{
    public ValidationException(IEnumerable<ValidationFailure> failures) : this()
    {
        Errors = failures
            .GroupBy(e => e.PropertyName, e => e.ErrorMessage)
            .ToDictionary(g => g.Key, f => f.ToArray());
    }

    public IDictionary<string, string[]> Errors { get; set; } = new Dictionary<string, string[]>();
}