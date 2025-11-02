using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Money_Muse_Backend.Data;
using Money_Muse_Backend.Interfaces;
using Money_Muse_Backend.Models;
using Money_Muse_Backend.Services;
using System.Security.Claims;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Load environment variables from a .env file
Env.Load();

// Configure database connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? throw new InvalidOperationException("Missing connection string");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(30), null);
        sqlOptions.CommandTimeout(30);
    });
    if (builder.Environment.IsDevelopment())
    {
       options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// Configure Identity
builder.Services.AddIdentity<ApplicationUser,IdentityRole<int>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure JWT Authentication
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
                ?? throw new InvalidOperationException("Missing JWT_SECRET_KEY environment variable");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        NameClaimType = ClaimTypes.NameIdentifier,
        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    };
});

// ==========================
// Controllers & Swagger
// ==========================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Money-Muse API",
        Version = "v1",
        Description = "API Documentation"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Register application services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<IUserService, UserService>();

// CORS Configuration - Flexible for local development, secure for production
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", corsBuilder =>
    {
        corsBuilder
            .SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;

                try
                {
                    var uri = new Uri(origin);

                    // Development: Allow any localhost/127.0.0.1 on any port with http or https
                    if (builder.Environment.IsDevelopment())
                    {
                        return uri.Host == "localhost" ||
                               uri.Host == "127.0.0.1" ||
                               uri.Host == "::1"; // IPv6 localhost
                    }

                    // Production: Only allow specific trusted origins
                    var allowedHosts = new[]
                    {
                        "zealous-desert-00ba4c703.2.azurestaticapps.net",
                        "skillsync-api-fwdydag0dcgpf8eq.southafricanorth-01.azurewebsites.net"
                    };

                    return allowedHosts.Contains(uri.Host, StringComparer.OrdinalIgnoreCase);
                }
                catch
                {
                    return false; // Invalid URI format
                }
            })
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("WWW-Authenticate");
    });
});

// Build the app
var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Money-Muse API v1"));
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowAngularDev");

app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Root redirect to Swagger UI
if (app.Environment.IsDevelopment())
{
    app.MapGet("/", () => Results.Redirect("/swagger"));
}

// Open Swagger in browser on development
if (app.Environment.IsDevelopment())
{
    var swaggerUrl = "https://localhost:7028/swagger"; // Adjust port if needed
    try
    {
        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
        {
            FileName = swaggerUrl,
            UseShellExecute = true
        });
    }
    catch
    {
        // Ignore errors (e.g., if not running on Windows)
    }
}

var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST");
var smtpPort = Environment.GetEnvironmentVariable("SMTP_PORT");
var smtpUser = Environment.GetEnvironmentVariable("SMTP_USERNAME");
var smtpPass = Environment.GetEnvironmentVariable("SMTP_PASSWORD");
var smtpFrom = Environment.GetEnvironmentVariable("SMTP_FROM");

// Run the app
app.Run();
