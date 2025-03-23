
"use client";

import React, { useEffect, useState } from "react";
import Song from './song'
import styles from './tracksShelf.module.css'

const TracksPage = () => {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      const accessToken = localStorage.getItem("spotify_access_token"); // Assuming the token is saved in localStorage

      try {
        const response = await fetch("https://api.spotify.com/v1/me/tracks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tracks");
        }

        const data = await response.json();
        setTracks(data.items);
      } catch (error) {
        setError("Failed to fetch tracks");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return <div>Loading tracks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Your Spotify Tracks</h1>
      <ul>
        {tracks.map((trackItem) => {
          const track = trackItem.track;
          return (
            <li key={track.id} style={{ marginBottom: "20px" }}>
              <div className={styles['shelf']}>
                <Song song_name={track.name} 
                album_cover={track.album.images[0]?.url} 
                album_name={track.album.name}
                artists={track.artists}
                songId={track.id}/>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TracksPage;
