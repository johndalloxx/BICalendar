using System.Text.Json.Serialization;

namespace BICalendar.Models.Responses;

public sealed record BICalendarResponse
{
	[JsonPropertyName("id")]
	public required string Id { get; init; }

	[JsonPropertyName("language")]
	public required string Language { get; init; }

	[JsonPropertyName("title")]
	public required string Title { get; init; }

	[JsonPropertyName("location")]
	public required string Location { get; init; }

	[JsonPropertyName("filterList")]
	public required string FilterList { get; init; }

	[JsonPropertyName("start")]
	public required DateTimeOffset Start { get; init; }

	[JsonPropertyName("end")]
	public required DateTimeOffset End { get; init; }

	[JsonPropertyName("startTime")]
	public required string StartTime { get; init; }

	[JsonPropertyName("endTime")]
	public required string EndTime { get; init; }

	[JsonPropertyName("url")]
	public required string Url { get; init; }

	[JsonPropertyName("imageUrl")]
	public required string ImageUrl { get; init; }

	[JsonPropertyName("imageText")]
	public required string ImageText { get; init; }

	[JsonPropertyName("bothLanguages")]
	public required bool BothLanguages { get; init; }
}
