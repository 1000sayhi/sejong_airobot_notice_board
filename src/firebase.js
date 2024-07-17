import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD7ckczZgvgl69npBQMrRwmVD8_TVSZKYE",
    authDomain: "noticeboard-account.firebaseapp.com",
    databaseURL: "https://noticeboard-account-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "noticeboard-account",
    storageBucket: "noticeboard-account.appspot.com",
    messagingSenderId: "529438110694",
    appId: "1:529438110694:web:1051c56f130b660c9a9c27",
    measurementId: "G-PPSF1L94T7"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
