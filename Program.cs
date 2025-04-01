using BICalendar.Models.Responses;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
builder.Services.AddOutputCache();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "BICalendar API",
		Version = "v1",
		Description = "API for fetching calendar events from BI",
	});
});


var app = builder.Build();
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI(options =>
	{
		options.SwaggerEndpoint("/swagger/v1/swagger.json", "BICalendar API v1");
	});
}

app.UseExceptionHandler("/error");
app.MapGet("/",
		async Task<Results<
		Ok<IEnumerable<BICalendarResponse>>,
		BadRequest<string>,
		UnprocessableEntity,
		InternalServerError<string>>>
		(IHttpClientFactory httpClientFactory,
		 [FromQuery] int? Take,
		 [FromQuery] string? Campus,
		 [FromQuery] string? Audience,
		 [FromQuery] string? Language = "all")
		=>
		{
			var queryParams = new Dictionary<string, string?>
			{
				{ "take", Take?.ToString() },
				{ "campus", Campus },
				{ "audience", Audience },
				{ "language", Language }
			};

			var uriBuilder = new UriBuilder("https://bi.no/api/calendar-events")
			{
				Query = string.Join("&", queryParams
						  .Where(kvp => kvp.Value is not null)
						  .Select(kvp => $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value!)}"))
			};

			using var httpClient = httpClientFactory.CreateClient();
			try
			{
				var response = await httpClient.GetAsync(uriBuilder.Uri);
				var json = await response.Content.ReadFromJsonAsync<IEnumerable<BICalendarResponse>>();
				if (json is null)
				{
					// TODO: Use Problem Details instead
					return TypedResults.UnprocessableEntity();
				}

				return TypedResults.Ok(json);
			}
			catch (HttpRequestException ex)
			{
				// TODO: Use proper logging
				Console.WriteLine($"Service unavilable: {ex}");
				// TODO: Extend TypedResults to accept 503 Service Unavailable
				// TODO: Use Problem Details instead
				return TypedResults.InternalServerError("Service unavilable");
			}
		}).CacheOutput(builder => builder.Expire(TimeSpan.FromMinutes(5)));

app.Run();
