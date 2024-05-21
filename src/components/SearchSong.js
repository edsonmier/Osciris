import React, { useState } from 'react';
import { searchSongs, uploadRequestedSong } from './songFunctions'; // Asegúrate de que estas funciones estén implementadas

function SearchSong({ setSongRequests }) {
  const [comment, setComment] = useState('');

  const handleSearchSongs = async () => {
    const matches = await searchSongs(comment);
    
    if (matches.length > 0) {
      await uploadRequestedSong(matches[0]); // Suponiendo que quieras subir la mejor coincidencia
      setSongRequests(prev => [...prev, matches[0]]); // Actualiza el estado global para reflejar la nueva solicitud de canción
    } else {
      console.log("No matches found.");
    }
  };

  return (
    <div>
      <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={handleSearchSongs}>Search Song</button>
    </div>
  );
}

export default SearchSong;
