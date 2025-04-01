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

function App() {
	const [events, setEvents] = useState<BICalendarEvent[]>();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		const fetchEvents = async () => {
			setError(null);
			setIsLoading(true);
			const response = await fetch("http://localhost:5284/events", {
				signal: signal,
				method: "GET"
			});
			if (!response.ok) {
				setError(`StatusCode: ${response.status}, Message: ${response.statusText}`);
				setIsLoading(false);
			}

			// Here I would zod validate the response
			const data: BICalendarEvent[] = await response.json();
			setIsLoading(false);
			setEvents(data);
		}

		fetchEvents();
		return () => {
			setIsLoading(false);
			controller.abort("useEffect");
		};
	}, []);

	return (
		<>
			<h1>BI Calendar Events</h1>
			{isLoading && <div>Loading...</div>}
			{error && <div>{error}</div>}
			{events && events.map(event =>
				<div className="card" key={event.id}>
					<div>{event.title}</div>
					<img src={event.imageUrl} />
					<div>{event.location}</div>
					<div>{event.startTime} - {event.endTime}</div>
					<div>{event.language}</div>
				</div>
			)}
		</>
	)
}

export default App
