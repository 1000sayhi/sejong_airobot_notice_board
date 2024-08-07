const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyCHTxOh0HucaSiNjYO-Z0LAld7uAete1oM",
  authDomain: "noticeboardrtdb.firebaseapp.com",
  databaseURL: "https://noticeboardrtdb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "noticeboardrtdb",
  storageBucket: "noticeboardrtdb.appspot.com",
  messagingSenderId: "120970806131",
  appId: "1:120970806131:web:2fbd6b953613747c9bbb06",
  measurementId: "G-JEWRC06RC3"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = { db };
// export { db };
