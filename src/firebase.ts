import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCBg3_BLAqVzQvg389KsjAm_qddYkS_ThY",
  authDomain: "fast-academy-296201.firebaseapp.com",
  projectId: "fast-academy-296201",
  storageBucket: "fast-academy-296201.appspot.com",
  messagingSenderId: "308403703206",
  appId: "1:308403703206:web:97617f4af5d044951d1367",
  measurementId: "G-SCWYTR4X7C",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();

export { storage, db, auth };
