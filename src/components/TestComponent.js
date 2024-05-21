import React, { useState, useEffect } from 'react';
import { searchSongs, handleSongRequest, handleDonation } from './songUtils';
import songsMock from './songsMock.json';
import console from '../libs/console-browserify';

const TestComponent = ({ onAddSong, onDonate, songRequests, onNotice }) => {
  const [user, setUser] = useState('');
  const [isSubscriber, setIsSubscriber] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [comment, setComment] = useState('');
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    console.log("Using mock data for songs");
    setSongs(songsMock);
  }, []);

  const handleAddSong = async () => {
    const matches = await searchSongs(comment);

    if (matches.length > 0) {
      const match = matches[0];
      await handleSongRequest(
        match.title, 
        match.artist, 
        match.albumCover, 
        match.duration, 
        match.difficulty, 
        user, 
        isSubscriber,
        onNotice
      );
      setComment('');
      onAddSong(user, match.title);
    } else {
      console.log("No matches found.");
    }
  };

  const handleManualDonation = async () => {
    await handleDonation(user, parseInt(donationAmount, 10), onNotice);
    setDonationAmount('');
    onDonate(user, donationAmount);
  };

  return (
    <div className="test-component">
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="Usuario"
      />
      <label>
        <input
          type="checkbox"
          checked={isSubscriber}
          onChange={(e) => setIsSubscriber(e.target.checked)}
        />
        Suscriptor
      </label>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentario"
      />
      <button onClick={handleAddSong}>Agregar Canción</button>

      <input
        type="number"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        placeholder="Donación"
      />
      <button onClick={handleManualDonation}>Donar</button>
    </div>
  );
};

export default TestComponent;
