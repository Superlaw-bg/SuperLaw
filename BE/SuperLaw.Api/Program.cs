using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SuperLaw.Data;
using SuperLaw.Data.DataSeeders;
using SuperLaw.Data.Models;
using SuperLaw.Services;
using System.Text;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Identity;
using Quartz;
using SuperLaw.Common.Options;
using SuperLaw.Services.Interfaces;
using SuperLaw.Api;
using SuperLaw.Api.Extensions;
using SuperLaw.Services.HostedServices;
using Twilio.Rest.Verify.V2.Service;
using Twilio;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<SuperLawDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("MainDbConnection")));

builder.Services
    .AddIdentity<User, Role>(options =>
    {
        options.Password.RequiredLength = 4;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.User.RequireUniqueEmail = true;
        options.SignIn.RequireConfirmedEmail = true;
    })
    .AddEntityFrameworkStores<SuperLawDbContext>();

var key = Encoding.ASCII.GetBytes(builder.Configuration["Secret"]);

builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddQuartz(q =>
{
    q.AddJobAndTrigger<MeetingsReminderJob>(builder.Configuration);
});

// Add the Quartz.NET hosted service

builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);


var cloudinaryCredentials = new Account(
    builder.Configuration["Cloudinary:CloudName"],
    builder.Configuration["Cloudinary:ApiKey"],
    builder.Configuration["Cloudinary:ApiSecret"]);

var cloudinaryUtility = new Cloudinary(cloudinaryCredentials);

builder.Services.AddIdentityCore<User>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<SuperLawDbContext>()
    .AddTokenProvider<DataProtectorTokenProvider<User>>(TokenOptions.DefaultProvider);
builder.Services.AddOptions();

builder.Services.Configure<EmailSendingOptions>(builder.Configuration.GetSection(EmailSendingOptions.Section));
builder.Services.Configure<ClientLinksOption>(builder.Configuration.GetSection(ClientLinksOption.Section));
builder.Services.Configure<CloudinaryOptions>(builder.Configuration.GetSection(CloudinaryOptions.Section));
builder.Services.Configure<TwilioOptions>(builder.Configuration.GetSection(TwilioOptions.Section));

builder.Services.AddSingleton(cloudinaryUtility);
builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddTransient<EmailService>();
builder.Services.AddTransient<ISimpleDataService, SimpleDataService>();
builder.Services.AddTransient<IFileUploadService, FileUploadService>();
builder.Services.AddTransient<IProfileService, ProfileService>();
builder.Services.AddTransient<IMeetingService, MeetingService>();
builder.Services.AddTransient<IStringEncryptService, StringEncryptService>();
builder.Services.AddTransient<ISmsService, SmsService>();

builder.Services.AddApplicationInsightsTelemetry(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]);

var twilioAccountSid = builder.Configuration["Twilio:AccountSid"];
var twilioAuthToken = builder.Configuration["Twilio:AuthToken"];

TwilioClient.Init(twilioAccountSid, twilioAuthToken);

var app = builder.Build();

using var serviceScope = app.Services.CreateScope();

using var context = serviceScope.ServiceProvider.GetRequiredService<SuperLawDbContext>();

context.Database.Migrate();

new RoleSeeder(context).Run();
new CitySeeder(context).Run();
new JudicialRegionSeeder(context).Run();
new LegalCategorySeeder(context).Run();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(options => options
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
