"use client";

import React, { useEffect, useState } from "react";

const EventRecommendation = ({ genres }: { genres: string[] }) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecommendedEvents = async () => {
      try {
        const res = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ genres }),
        });

        const data = await res.json();
        if (res.ok) {
          setEvents(data.events);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Failed to fetch recommended events:", err);
      }
    };

    if (genres.length > 0) {
      fetchRecommendedEvents();
    }
  }, [genres]);

  return (
    <div className="event-container">
      <h2>Recommended Events</h2>
      <div className="events">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.images[0]?.url} alt={event.name} />
              <h3>{event.name}</h3>
              <p>{event.dates?.start?.localDate}</p>
              <p>{event._embedded?.venues[0]?.name}</p>
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                View Event
              </a>
            </div>
          ))
        ) : (
          <p>No events found yet. Try another song!</p>
        )}
      </div>
    </div>
  );
};

export default EventRecommendation;
