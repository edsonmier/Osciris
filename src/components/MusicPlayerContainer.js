import React, { useState, useEffect } from 'react';
import '../styles/MusicPlayerContainer.css';
import NowPlaying from './NowPlaying';
import SongsList from './SongsList';
import db from '../firebase-config';
import console from '../libs/console-browserify';

import { collection, getDocs, onSnapshot, deleteDoc, doc, query, orderBy } from "firebase/firestore";

function MusicPlayerContainer({ onUserAction, currentSong, onNotice }) {
    const [songRequests, setSongRequests] = useState([]); // Almacena las solicitudes de canciones

    useEffect(() => {
        // Suscripción a solicitudes de canciones en Firestore
        const q = query(collection(db, "requestedsongs"), orderBy("points", "desc"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("snpashot")
            const newRequests = snapshot.docs.map((doc, index) => ({
                ...doc.data(),
                id: doc.id,
                position: index + 1
            }));
            setSongRequests(newRequests);
            onUserAction({ type: 'UPDATE_SONG_REQUESTS', payload: newRequests });
        });

        return () => unsubscribe(); // Limpieza del efecto
    }, 
    [onUserAction]);

    const fakeSongData = {
        title: "ROLLER COASTER",
        artist: "TOMORROW X TOGETHER",
        cover: "https://i1.sndcdn.com/artworks-000616248094-qvyogs-t500x500.jpg"
    };

    return (
        <div className="music-player-container">
            <NowPlaying currentSong={currentSong} />
            <SongsList songs={songRequests} />
        </div>
    );
}

export default MusicPlayerContainer;
