"use client";

import React, { useEffect, useState } from "react";
import styles from "./events.module.css"

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
    <div className={styles.eventContainer}>
      <h2>Recommended Events</h2>
      <div className={styles.events}>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <img
                src={event.images[0]?.url}
                alt={event.name}
                className={styles.eventImage}
              />
              <h3 className={styles.eventName}>{event.name}</h3>
              <p className={styles.eventDate}>{event.dates?.start?.localDate}</p>
              <p className={styles.eventVenue}>
                {event._embedded?.venues[0]?.name}
              </p>
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.eventLink}
              >
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
