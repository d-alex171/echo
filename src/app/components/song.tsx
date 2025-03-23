import React, { useEffect, useState } from "react";
import styles from "./song.module.css" 
import EventRecommendation from "./events"

const Song = ({
  song_name,
  artists,
  album_cover,
  album_name,
  songId
}: {
  song_name: string;
  artists: { name: string , id: string}[];
  album_cover: string;
  album_name: string;
  songId: any;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const accessToken = localStorage.getItem("spotify_access_token"); 
  
  const fullGenreList: any[] = [];
  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };


  useEffect(() => {
    const fetchGenreId = async () => {
      try {
        const artistIdList = artists.map((a) => a.id).join(",");
        const response = await fetch(
          "https://api.spotify.com/v1/artists?ids=" + artistIdList,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch artists");
        }
  
        const data = await response.json();
  
        // Collect genres into a single list
        const allGenres = data.artists.flatMap((artist: any) => artist.genres);
  
        // Optional: remove duplicates
        const uniqueGenres = [...new Set(allGenres)];
  
        // Set in state
        setGenres(uniqueGenres);
      } catch (error) {
        setError("Failed to fetch artist genres");
        console.error(error);
      }
    };
  
    fetchGenreId();
  }, [artists, accessToken]);
  

  return (
    <>
      <div className={styles.song}>
        <img
          src={album_cover}
          alt={album_name}
          className={styles["album-cover"]}
          onClick={toggleExpand}
        />
        <div className={styles["song-info"]}>
          <strong>
            {artists.map((artist) => artist.name).join(", ")} – {song_name}
          </strong>
          <p>Album: {album_name}</p>
        </div>
      </div>

      {expanded && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={toggleExpand}>
              &times;
            </button>
            <div className={styles["expanded-info"]}>
              <img
                src={album_cover}
                alt={album_name}
                className={styles["modal-album"]}
              />
              <h2>{song_name}</h2>
              <p><strong>Artists:</strong> {artists.map((a) => a.name).join(", ")}</p>
              <p><strong>Album:</strong> {album_name}</p>
              {genres.length > 0 && (
                <>
                  <p><strong>Genres:</strong> {genres.join(", ")}</p>
                  <EventRecommendation genres={genres} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Song;
