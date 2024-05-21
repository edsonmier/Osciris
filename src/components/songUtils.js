import { increment, arrayUnion, arrayRemove, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Fuse from 'fuse.js';
import db from '../firebase-config';
import { normalizarTexto } from './utils';
import songsMock from './songsMock.json';
import console from '../libs/console-browserify';
import topDonors from './topDonors'; // Asegúrate de importar el archivo topDonors


// Lista de suscriptores para simulación
const subscribers = new Set(["osciris.bot","cossaya", "manzanillaaaa_", "yazmin.rdt", "danielachimal9", "maysita933", "hyunjinduraznitos"]);

export const handleSongRequest = async (title, artist, albumCover, duration, difficulty, user, isSubscriber, onNotice) => {
    const userRequestQuery = query(collection(db, "requestedsongs"), where("voters", "array-contains", user));
    const userRequestsSnapshot = await getDocs(userRequestQuery);

    if (!userRequestsSnapshot.empty) {
        console.log("El usuario ya tiene una petición activa.");
        return;
    }
    const songRequestRef = collection(db, "requestedsongs");
    const q = query(songRequestRef, where("title", "==", title), where("artist", "==", artist));

    try {
        const snapshot = await getDocs(q);
        let points = 1;

        if (topDonors.has(user)) {
            points = 1000;
        } else if (isSubscriber) {
            points = 100;
        }

        console.log(isSubscriber);
        console.log(points);

        if (!snapshot.empty) {
            snapshot.forEach(async (docSnapshot) => {
                const data = docSnapshot.data();
                if (data.voters.includes(user)) {
                    console.log("El usuario ya ha votado por esta canción.");
                } else {
                    await updateDoc(docSnapshot.ref, {
                        points: increment(points),
                        voters: arrayUnion(user)
                    });
                    onNotice({
                        type: 'SONG_VOTED',
                        user: user,
                        songTitle: title,
                        artistName: artist,
                        coverImage: albumCover,
                        amount: points
                    });
                }
            });
        } else {
            const newSongRequest = {
                title,
                artist,
                albumCover,
                duration,
                difficulty,
                points,
                voters: [user],
                timestamp: serverTimestamp()
            };
            await addDoc(songRequestRef, newSongRequest);
            onNotice({
                type: 'SONG_ADDED',
                user: user,
                songTitle: title,
                artistName: artist,
                coverImage: albumCover,
                amount: points
            });
        }
    } catch (error) {
        console.error("Error handling song request:", error);
    }
};

// Función para verificar si el usuario es suscriptor
export const checkIfSubscriber = (userId) => {
    return subscribers.has(userId);
};

export const searchSongs = async (comment) => {
    const commonWords = ["pon", "poner", "pongan", "algo", "ay", "yo", "la", "de", "jugar", "puedes", "podrías", "tocar", "pls", "por", "favor", "canción", "of", "quiero", "please", "play", "can", "una", "de", "porfa", "te", "gusta"];
    const normalizedComment = normalizarTexto(comment);

    let words = normalizedComment.split(' ').filter(word => !commonWords.includes(normalizarTexto(word)) && !/(.)\1{2,}/.test(word));
    let filteredComment = words.join(' ');

    if (!filteredComment.length) return [];

    let songs = songsMock.map(song => ({
        ...song,
        titleNormalized: normalizarTexto(song.title || ''),
        artistNormalized: normalizarTexto(song.artist || ''),
        artistAliasesNormalized: song.artistAliases ? song.artistAliases.map(alias => normalizarTexto(alias)) : []
    }));

    let directArtistMatch = songs.filter(song => 
        filteredComment === song.artistNormalized ||
        song.artistAliasesNormalized.includes(filteredComment)
    );

    if (directArtistMatch.length > 0 && words.length === 1) {
        return [directArtistMatch[Math.floor(Math.random() * directArtistMatch.length)]];
    }

    let titleMatches = songs.filter(song => filteredComment.includes(song.titleNormalized));
    let artistMatches = songs.filter(song => 
        filteredComment.includes(song.artistNormalized) ||
        song.artistAliasesNormalized.some(alias => filteredComment.includes(alias))
    );

    let matches = [...new Set([...titleMatches, ...artistMatches])];

    if (matches.length > 0) {
        const fuse = new Fuse(matches, {
            includeScore: true,
            keys: ['titleNormalized', 'artistNormalized', 'artistAliasesNormalized'],
            shouldSort: true
        });

        let scoreThreshold = words.length > 1 ? 0.6 : 0.01;
        let results = fuse.search(filteredComment).filter(result => result.score <= scoreThreshold);

        return results.map(result => result.item);
    }

    return [];
};

export const handleRemoveVote = async (user, onNotice) => {
    const userRequestQuery = query(collection(db, "requestedsongs"), where("voters", "array-contains", user));
    const userRequestsSnapshot = await getDocs(userRequestQuery);
  
    if (userRequestsSnapshot.empty) {
      console.log("El usuario no tiene peticiones activas.");
      return;
    }
  
    userRequestsSnapshot.forEach(async (docSnapshot) => {
      const data = docSnapshot.data();
      let pointsToRemove = 1;
  
      if (topDonors.has(user)) {
        pointsToRemove = 1000;
      } else if (subscribers.has(user)) {
        pointsToRemove = 100;
      }
  
      await updateDoc(docSnapshot.ref, {
        points: increment(-pointsToRemove),
        voters: arrayRemove(user)
      });
  
      onNotice({
        type: 'SONG_VOTE_REMOVED',
        user: user,
        songTitle: data.title,
        artistName: data.artist,
        coverImage: data.albumCover,
        amount: pointsToRemove
      });
  
      if (data.points - pointsToRemove <= 0) {
        await deleteDoc(docSnapshot.ref);
      }
    });
  };

export const handleDonation = async (userId, diamondCount, onNotice) => {
    const songRequestQuery = query(collection(db, "requestedsongs"), where("voters", "array-contains", userId));
    const songRequestsSnapshot = await getDocs(songRequestQuery);
  
    if (songRequestsSnapshot.empty) {
      console.log("El usuario no tiene peticiones activas.");
      return;
    }
  
    songRequestsSnapshot.forEach(async (docSnapshot) => {
      const data = docSnapshot.data();
      await updateDoc(docSnapshot.ref, {
        points: increment(diamondCount)
      });
  
      onNotice({
        type: 'SONG_BOOSTED',
        user: userId,
        songTitle: data.title,
        artistName: data.artist,
        coverImage: data.albumCover,
        amount: diamondCount
      });
    });
  };
  
  
