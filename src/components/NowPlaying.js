import React, { useState, useEffect } from 'react';
import '../styles/NowPlaying.css'; // Asegúrate de tener este archivo CSS para los estilos

function NowPlaying({ currentSong }) {
    const [language, setLanguage] = useState('EN');

    useEffect(() => {
        const interval = setInterval(() => {
            setLanguage((prev) => (prev === 'EN' ? 'ES' : 'EN'));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!currentSong) {
        // Manejar el caso de no tener una canción actual, por ejemplo, mostrando un mensaje o un estado predeterminado
        return <div className="now-playing">Seleccione una canción...</div>;
      }

    return (
        <div className="now-playing">
        <div id="wrap">
            <div id="album">
                <div id="cover" style={{ backgroundImage: `url(${currentSong.albumCover})`}}>
                    <div id="print">
                    </div>
                </div>
                <div id="vinyl">
                    <div id="print" style={{ backgroundImage: `url(${currentSong.albumCover})`}}>
                    </div>
                </div>
            </div>
        </div>
            <div className="song-info">
                <h3>{language === 'EN' ? 'NOW PLAYING' : 'REPRODUCIENDO AHORA'}</h3>
                <p>{currentSong.title}</p>
                <p>{currentSong.artist}</p>
            </div>
        </div>
    );
}

export default NowPlaying;
