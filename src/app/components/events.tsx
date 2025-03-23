"use client";

import React, { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_KEY;

const EventRecommendation = ({ genres }: { genres: string[] }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [genreIds, setGenreIds] = useState<string[]>([]);

  // Fetch Ticketmaster genre IDs based on Spotify genres
  useEffect(() => {
    const fetchGenreIds = async () => {
      try {
        const ids: string[] = [];

        for (const genre of genres) {
          const encodedGenre = encodeURIComponent(genre);
          const res = await fetch(
            `https://app.ticketmaster.com/discovery/v2/classifications.json?apikey=${API_KEY}&keyword=${encodedGenre}`
          );
          const data = await res.json();
          const classifications = data._embedded?.classifications ?? [];

          classifications.forEach((classification: any) => {
            const genreList = classification.segment?._embedded?.genres ?? [];
            genreList.forEach((genre: any) => {
              if (!ids.includes(genre.id)) {
                ids.push(genre.id);
              }
            });
          });
        }

        setGenreIds(ids);
      } catch (err) {
        console.error("Failed to fetch Ticketmaster genre IDs:", err);
      }
    };

    if (genres.length > 0) {
      fetchGenreIds();
    }
  }, [genres]);

  // Fetch events after genre IDs are available
  useEffect(() => {
    const fetchEvents = async () => {
      if (genreIds.length === 0) return;

      try {
        const allEvents: any[] = [];

        // Make an API request for each genre ID
        for (const genreId of genreIds) {
          const res = await fetch(
            `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=5&genreId=${genreId}`
          );
          const data = await res.json();
          const eventList = data._embedded?.events || [];
          allEvents.push(...eventList);
        }

        setEvents(allEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, [genreIds]);

  return (
    <div className="event-container">
      <h2>Recommended Events</h2>
      <div className="events">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.images[0].url} alt={event.name} />
              <h3>{event.name}</h3>
              <p>{event.dates.start.localDate}</p>
              <p>{event._embedded.venues[0].name}</p>
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
