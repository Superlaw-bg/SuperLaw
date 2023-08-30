using Microsoft.EntityFrameworkCore;
using SuperLaw.Data;
using SuperLaw.Data.DataSeeders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//TODO: Add seeders for cities, legal categories and judicial regions
builder.Services.AddDbContext<SuperLawDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("MainDbConnection")));

var app = builder.Build();

using var serviceScope = app.Services.CreateScope();

using var context = serviceScope.ServiceProvider.GetRequiredService<SuperLawDbContext>();

context.Database.EnsureCreated();

new CitySeeder(context).Run();
new JudicialRegionSeeder(context).Run();
new LegalCategorySeeder(context).Run();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
