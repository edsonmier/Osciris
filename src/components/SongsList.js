import React, { useEffect, useRef } from 'react';
import SongItem from './SongItem';
import '../styles/SongsList.css';

function SongsList({ songs }) {
  const listRef = useRef();

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      const listHeight = list.scrollHeight; // Utiliza scrollHeight para obtener la altura total del contenido
      const containerHeight = list.parentElement.offsetHeight;

      if (listHeight > containerHeight) {
        const scrollDistance = listHeight - containerHeight; // Calcula cuánto necesita desplazarse la lista
        list.style.setProperty('--scroll-distance', `-${scrollDistance}px`); // Asigna la distancia de desplazamiento como una propiedad CSS
        list.classList.add('scroll-animation'); // Aplica la clase con la animación
      } else {
        list.classList.remove('scroll-animation'); // Elimina la animación si no es necesaria
      }
    }
  }, [songs]); // Dependencia en la lista de canciones

  return (
    <div className="main">
      <h3>SONGS LIST</h3>
      <div className="songs-list-container">
        <div className="songs-list" ref={listRef}>
        {songs.slice(0, 10).map((song, index) => (
            <SongItem key={index} song={song} position={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SongsList;
