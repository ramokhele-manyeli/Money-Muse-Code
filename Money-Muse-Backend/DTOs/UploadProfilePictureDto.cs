using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;

public class UploadProfilePictureDto : IValidatableObject
{
    public IFormFile File { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (File == null)
        {
            yield return new ValidationResult("File is required.", new[] { nameof(File) });
            yield break;
        }

        // Max size: 5MB
        const long maxSize = 5 * 1024 * 1024;
        if (File.Length > maxSize)
        {
            yield return new ValidationResult("File size must not exceed 5MB.", new[] { nameof(File) });
        }

        // Allowed types: JPEG, PNG
        var allowedTypes = new[] { "image/jpeg", "image/png" };
        if (!allowedTypes.Contains(File.ContentType))
        {
            yield return new ValidationResult("Only JPEG and PNG images are allowed.", new[] { nameof(File) });
        }
    }
}