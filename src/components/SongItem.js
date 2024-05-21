import React from 'react';
import '../styles/SongItem.css';

function SongItem({ song, position }) {
    return (
        <div className="song-item">
            <div className="song-number">{position}</div>
            <img src={song.albumCover} alt="Cover" className="song-cover" /> {/* Imagen de la portada */}
            <div className="song-info">
                <p className="song-title">{song.title}</p>
                <p className="song-artist">{song.artist}</p>
            </div>
            {/* Aquí podrías añadir la lógica para mostrar los donantes que han impulsado la canción */}
        </div>
    );
}

export default SongItem;
