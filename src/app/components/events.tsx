// components/EventRecommendation.tsx
"use client";

import React, { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_KEY;

const EventRecommendation = (props:{genres: any}) => {
  const [events, setEvents] = useState<any[]>([]);
  const genreIds: { id: any; name: any; }[] = [];
  useEffect(() => {
    const fetchGenreid = async () => {
        try {
            const res = await fetch(
              `https://app.ticketmaster.com//discovery/v2/classifications.json?apikey=${API_KEY}&keyword=${props.genres}`
            );
            const data = await res.json();
            const classifications = data._embedded?.classifications ?? [];
            classifications.forEach((classifications: { segment: { _embedded: { genres: any[]; }; }; }) => {
                const genres = classifications.segment?._embedded?.genres ?? [];
                genres.forEach(genre  => {
                  // Store the genre id and name (optional)
                  genreIds.push({
                    id: genre.id,
                    name: genre.name
                  });
                });
              });
              
          } catch (err) {
            console.error("Failed to fetch genre:", err);
          }
    }

    const fetchEvents = async () => {
      const genreIdList = genreIds.map(g => g.id).join(',');
      try {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=5&genreId=${genreIdList}`
        );
        const data = await res.json();
        const eventList = data._embedded?.events || [];
        setEvents(eventList);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-container">
      <h2>Recommended Events</h2>
      <div className="events">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <img src={event.images[0].url} alt={event.name} />
            <h3>{event.name}</h3>
            <p>{event.dates.start.localDate}</p>
            <p>{event._embedded.venues[0].name}</p>
            <a href={event.url} target="_blank" rel="noopener noreferrer">View Event</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRecommendation;
