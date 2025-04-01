import { useEffect, useState } from 'react';
import './App.css'

type BICalendarEvent = {
	id: string;
	language: string;
	title: string;
	location: string;
	filterList: string;
	start: string;
	end: string;
	startTime: string;
	endTime: string;
	url: string;
	imageUrl: string;
	imageText: string;
	bothLanguages: boolean;
};

const filters = [
	"Oslo",
	"Bergen",
	"Stavanger",
	"Trondheim",
	"Executive",
	"student-portal",
	"research",
	"alumni-partner",
] as const;

type FilterType = typeof filters[number];

function App() {
	const [selectedFilter, setSelectedFilter] = useState<FilterType | "">("");
	const [events, setEvents] = useState<BICalendarEvent[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		const fetchEvents = async () => {
			setError(null);
			setIsLoading(true);
			try {
				const response = await fetch("http://localhost:5284/events", {
					signal: signal,
					method: "GET"
				});

				if (!response.ok) {
					throw new Error(`StatusCode: ${response.status}, Message: ${response.statusText}`);
				}

				// Here I would zod validate the response
				const data: BICalendarEvent[] = await response.json();
				setEvents(data);
			} catch (err) {
				//@ts-expect-error: Would use something else to fetch
				if (err.name !== 'AbortError') {
					//@ts-expect-error: Would use something else to fetch
					setError(err.message);
				}
			} finally {
				setIsLoading(false);
			}
		}

		fetchEvents();
		return () => {
			controller.abort("useEffect");
		};
	}, []);

	const filteredEvents = selectedFilter
		? events.filter(event => event.filterList.includes(selectedFilter))
		: events;

	return (
		<>
			<h1>BI Calendar Events</h1>

			<div >
				<label htmlFor="filter-select">Filter by: </label>
				<select
					id="filter-select"
					value={selectedFilter}
					onChange={(e) => setSelectedFilter(e.target.value as FilterType | "")}
				>
					<option value="">All Events</option>
					{filters.map(filter => (
						<option key={filter} value={filter}>
							{filter}
						</option>
					))}
				</select>
			</div>

			{isLoading && <div className="loading">Loading...</div>}
			{error && <div className="error">{error}</div>}

			<div className="events-grid">
				{filteredEvents.length === 0 && !isLoading ? (
					<p>No events found{selectedFilter ? ` for filter "${selectedFilter}"` : ""}.</p>
				) : (
					filteredEvents.map(event => (
						<div className="card" key={event.id}>
							<h3>{event.title}</h3>
							{event.imageUrl && (
								<img
									src={event.imageUrl}
									alt={event.imageText || event.title}
									className="event-image"
								/>
							)}
							<div>
								<p><strong>Location:</strong> {event.location}</p>
								<p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
								<p><strong>Language:</strong> {event.language}</p>
								{event.url && (
									<a href={event.url} target="_blank" rel="noopener noreferrer" className="event-link">
										More details
									</a>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</>
	)
}

export default App
