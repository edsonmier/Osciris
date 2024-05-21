const admin = require('firebase-admin');
const fs = require('fs');

// Inicializa la aplicación Firebase
const serviceAccount = require('./osciris-hub-firebase-adminsdk-tuasr-2fb4280f2f.json'); // Asegúrate de que la ruta al archivo JSON sea correcta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportCollection() {
  const collectionRef = db.collection('songslist'); // Cambia 'your_collection_name' por el nombre de tu colección
  const querySnapshot = await collectionRef.get();
  const data = [];

  querySnapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });

  // Guarda los datos en un archivo JSON
  fs.writeFile('output.json', JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
    console.log('Data exported successfully to output.json');
  });
}

exportCollection();
