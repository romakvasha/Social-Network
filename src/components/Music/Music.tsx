import React, { useState } from "react";

const playlist = [
  { id: 1, artist: "Океан Ельзи", title: "Обійми" },
  { id: 2, artist: "Kalush Orchestra", title: "Stefania" },
  { id: 3, artist: "Jamala", title: "1944" },
  { id: 4, artist: "Бумбокс", title: "Вахтерам" },
];

const Music: React.FC = () => {
  const [favorites, setFavorites] = useState<Array<number>>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  return (
    <div className="page">
      <h2>Music</h2>
      <ul className="list">
        {playlist.map((track) => (
          <li key={track.id}>
            <span>
              <b>{track.artist}</b> — {track.title}
            </span>
            <button onClick={() => toggleFavorite(track.id)}>
              {favorites.includes(track.id) ? "★" : "☆"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Music;
