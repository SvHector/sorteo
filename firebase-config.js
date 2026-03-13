// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj199sP7xKFUyzSjWfVZFwkNbwor7OqAY",
  authDomain: "rifabisuteria.firebaseapp.com",
  projectId: "rifabisuteria",
  storageBucket: "rifabisuteria.firebasestorage.app",
  messagingSenderId: "159083335877",
  appId: "1:159083335877:web:9c972030527ed9e13aa0ac"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set };