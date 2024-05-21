const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { WebcastPushConnection } = require('tiktok-live-connector');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:3001"
}));

const tiktokUsername = "lanaslifeee";
const tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

// Inicializa el conjunto con los suscriptores existentes
const initialSubscribers = ["osciris.bot","cossaya", "manzanillaaaa_", "yazmin.rdt", "danielachimal9", "maysita933", "hyunjinduraznitos"];
const subscribers = new Set(initialSubscribers);

tiktokLiveConnection.connect().then(state => {
  console.info(`Connected to roomId ${state.roomId}`);
}).catch(err => {
  console.error('Failed to connect', err);
});

tiktokLiveConnection.on('chat', data => {
  const isSubscriber = subscribers.has(data.uniqueId);
  io.emit('songRequest', { 
    comment: data.comment, 
    userId: data.userId, 
    uniqueId: data.uniqueId, 
    isSubscriber 
  });
});

tiktokLiveConnection.on('gift', data => {
  io.emit('giftReceived', { 
    giftId: data.giftId, 
    userId: data.userId, 
    uniqueId: data.uniqueId, 
    giftType: data.giftType,
    diamondCount: data.diamondCount
  });
});

tiktokLiveConnection.on('subscribe', data => {
  console.log(`User ${data.uniqueId} subscribed`);
  subscribers.add(data.uniqueId); // Agregar el usuario a la lista de suscriptores
});

tiktokLiveConnection.on('unsubscribe', data => {
  console.log(`User ${data.uniqueId} unsubscribed`);
  subscribers.delete(data.uniqueId); // Eliminar el usuario de la lista de suscriptores
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
