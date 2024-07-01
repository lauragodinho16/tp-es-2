const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');
const { config } = require('dotenv');


// Carregar as variáveis de ambiente do arquivo .env
config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Instância do Firestore
const firestore = getFirestore(app);

// Instância do Storage
const storagee = getStorage(app);

module.exports = { firestore, storagee, app };
