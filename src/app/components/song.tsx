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
  artists: { name: string }[];
  album_cover: string;
  album_name: string;
  songId: any;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className={`song ${expanded ? "expanded" : ""}`}>
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

        {expanded && (
          <div className={styles["expanded-info"]}>
            <p><strong>Artists:</strong> {artists.map((a) => a.name).join(", ")}</p>
            <p><strong>Song:</strong> {song_name}</p>
            <p><strong>Album:</strong> {album_name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Song;
