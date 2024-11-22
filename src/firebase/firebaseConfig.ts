// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getStorage } from "firebase/storage";

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQnHfFJcbN8BkJQkqf1RiGp5XMAtemjxs",
  authDomain: "rental-room-app-cf629.firebaseapp.com",
  projectId: "rental-room-app-cf629",
  storageBucket: "rental-room-app-cf629.appspot.com",
  messagingSenderId: "1080683981377",
  appId: "1:1080683981377:web:ecec5d5c891c7e258074c0",
  measurementId: "G-PEG5PR9C3H"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getStorage(FIREBASE_APP);


signInAnonymously(FIREBASE_AUTH)
  .then((userCredential) => {
    console.log("Firebase Auth kết nối thành công: ", userCredential);
  })
  .catch((error) => {
    console.error("Lỗi kết nối Firebase Auth: ", error);
  });

// const firebaseConfig = {
//   apiKey: "AIzaSyC7EHNEXx70w-Y95s2dZW6rR6diJDkL99M",
//   authDomain: "zalo-chats-10f1e.firebaseapp.com",
//   projectId: "zalo-chats-10f1e",
//   storageBucket: "zalo-chats-10f1e.appspot.com",
//   messagingSenderId: "1071228614114",
//   appId: "1:1071228614114:web:d237cd487ccf81952f35bb",
// };
// export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// export const FIREBASE_DB = getStorage(FIREBASE_APP);