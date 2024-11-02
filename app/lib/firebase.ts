import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_APIKEY,
//   authDomain: process.env.FIREBASE_AUTHDOMAIN,
//   projectId: process.env.FIREBASE_PROJECTID,
//   storageBucket: process.env.FIREBASE_STORAGEBUCKET,
//   messagingSenderId: process.env.FIREBASE_MSGID,
//   appId: process.env.FIREBASE_APPID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyClDpHDLGCF4tpPJPDoIvHVQ1AfeFEtpHE",
  authDomain: "lungu-project-59ce2.firebaseapp.com",
  projectId: "lungu-project-59ce2",
  storageBucket: "lungu-project-59ce2.appspot.com",
  messagingSenderId: "183711167576",
  appId: "1:183711167576:web:9df3a556c23c7d8ab5862d",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
