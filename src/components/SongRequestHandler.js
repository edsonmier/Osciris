import React, { useEffect } from 'react';
import socket from '../socket';
import { handleSongRequest as handleRequest, searchSongs, checkIfSubscriber, handleRemoveVote, handleDonation } from './songUtils';
import console from '../libs/console-browserify';

function SongRequestHandler({ onNotice }) {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('songRequest', async (data) => {
      console.log(`Received songRequest: ${data.comment} from ${data.uniqueId}`);
      if (data.comment === 'bye vote') {
        await handleRemoveVote(data.uniqueId, onNotice);
      } else {
        const matches = await searchSongs(data.comment);
        const isSubscriber = checkIfSubscriber(data.uniqueId);
        if (matches.length > 0) {
          const match = matches[0];
          await handleRequest(
            match.title, 
            match.artist, 
            match.albumCover, 
            match.duration, 
            match.difficulty, 
            data.uniqueId, 
            isSubscriber,
            onNotice
          );
        } else {
          console.log("No se encontraron coincidencias.");
        }
      }
    });

    socket.on('giftReceived', async (data) => {
      console.log(`Received gift: ${data.giftId} from ${data.uniqueId} with ${data.diamondCount} coins`);
      await handleDonation(data.uniqueId, data.diamondCount, onNotice);
    });

    return () => {
      socket.off('songRequest');
      socket.off('giftReceived');
    };
  }, [onNotice]);

  return null;
}

export default SongRequestHandler;
