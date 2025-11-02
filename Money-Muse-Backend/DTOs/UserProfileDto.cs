public class UserProfileDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Currency { get; set; } = "ZAR";
    public string DateFormat { get; set; } = "MM/dd/yyyy";
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
}