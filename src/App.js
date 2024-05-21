import React, { useState, useCallback, useEffect } from 'react';
import MusicPlayerContainer from './components/MusicPlayerContainer';
import TestComponent from './components/TestComponent';
import NoticeScreen from './components/NoticeScreen';
import { deleteDoc, doc } from "firebase/firestore";
import db from './firebase-config';
import PlayerControls from './components/PlayerControls';
import './App.css';
import console from './libs/console-browserify';
import SongRequestHandler from './components/SongRequestHandler';

function App() {
  const [notices, setNotices] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [songRequests, setSongRequests] = useState([]);

  const handleSongRequest = (comment, userId) => {
    console.log(`Received song request from ${userId}: ${comment}`);
  };

  const handleGift = (giftId, userId) => {
    console.log(`Received gift ${giftId} from ${userId}`);
  };

  const handleAddSong = (user, song) => {
    console.log(`${user} agregó la canción ${song}`);
    setNotices(prev => [...prev, `${user} agregó la canción ${song}`]);
  };

  useEffect(() => {
    const storedSong = localStorage.getItem('currentSong');
    if (storedSong) {
      setCurrentSong(JSON.parse(storedSong));
    }
  }, []);

  useEffect(() => {
    if (currentSong) {
      localStorage.setItem('currentSong', JSON.stringify(currentSong));
    }
  }, [currentSong]);

  const playNextSong = async () => {
    if (songRequests.length > 0) {
      const nextSong = songRequests[0];
      setCurrentSong(nextSong);
      await deleteDoc(doc(db, "requestedsongs", nextSong.id));
      const remainingRequests = songRequests.slice(1);
      setSongRequests(remainingRequests);
    } else {
      console.log("No hay más canciones en la lista de solicitudes.");
    }
  };

  const handleDonate = (user, amount) => {
    console.log(`${user} donó ${amount}`);
    setNotices(prev => [...prev, `${user} donó ${amount}`]);
  };

  const addNotice = (notice) => {
    const truncatedUser = notice.user && notice.user.length > 12 ? notice.user.substring(0, 12) + '...' : notice.user;
    setNotices((prevNotices) => [...prevNotices, { ...notice, user: truncatedUser, id: Date.now() }]);
  };

  const onNotice = useCallback((event) => {
    const truncatedUser = event.user && event.user.length > 12 ? event.user.substring(0, 12) + '...' : event.user;
    switch (event.type) {
      case 'SONG_ADDED':
        addNotice({
          type: 'SONG_ADDED',
          user: truncatedUser,
          message: `agregó`,
          songTitle: event.songTitle,
          artistName: event.artistName,
          coverImage: event.coverImage,
          infoText: `+${event.amount}`
        });
        break;
      case 'SONG_VOTED':
        addNotice({
          type: 'SONG_VOTED',
          user: truncatedUser,
          message: `votó`,
          songTitle: event.songTitle,
          artistName: event.artistName,
          coverImage: event.coverImage,
          infoText: `+${event.amount}`
        });
        break;
      case 'SONG_BOOSTED':
        console.log(event.amount);
        addNotice({
          type: 'SONG_BOOSTED',
          user: truncatedUser,
          message: `potenció`,
          songTitle: event.songTitle,
          artistName: event.artistName,
          coverImage: event.coverImage,
          infoText: `+${event.amount}`
        });
        break;
      default:
        console.log("Tipo de notificación desconocido:", event.type);
    }
  }, []);

  const dismissNotice = (noticeId) => {
    setNotices((currentNotices) => currentNotices.filter(notice => notice.id !== noticeId));
  };

  const onUserAction = useCallback((action) => {
    if (action.type === 'ADD_NOTICE') {
      setNotices(prev => [...prev, action.payload]);
    } else if (action.type === 'UPDATE_SONG_REQUESTS') {
      setSongRequests(action.payload);
    }
  }, []);

  return (
    <div className="App">
      <div className='Space'>
        <MusicPlayerContainer onUserAction={onUserAction} currentSong={currentSong} onNotice={onNotice} />
        <TestComponent onAddSong={handleAddSong} onDonate={handleDonate} songRequests={songRequests} onNotice={onNotice} />
        <PlayerControls handleNextSong={playNextSong} />
      </div>
      <div className='NoticeBar'>
        <NoticeScreen notices={notices} onDismiss={dismissNotice} />
      </div>
      <SongRequestHandler onNotice={onNotice} />
    </div>
  );
}

export default App;
