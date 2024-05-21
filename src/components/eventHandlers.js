const { searchSongs, handleSongRequest } = require('./songUtils');

async function handleSongRequestFromChat(comment, userId) {
    const matches = await searchSongs(comment);
    if (matches.length > 0) {
        const match = matches[0];
        await handleSongRequest(match.title, match.artist, match.albumCover, match.duration, match.difficulty, userId, onNotice);
    } else {
        console.log("No se encontraron coincidencias.");
    }
}

function handleGiftEvent(data) {
    console.log(`Usuario ${data.uniqueId} envió un regalo con ID ${data.giftId}`);
    // Aquí puedes implementar la lógica para actualizar los puntos de las canciones y enviar notificaciones
}

module.exports = { handleSongRequestFromChat, handleGiftEvent };
