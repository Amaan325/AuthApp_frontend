import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDKVATxGWkQTTdCNxcP1dswqmXmOfrbgJo",
  authDomain: "auth-app-1f45a.firebaseapp.com",
  projectId: "auth-app-1f45a",
  storageBucket: "auth-app-1f45a.appspot.com",
  messagingSenderId: "589456717932",
  appId: "1:589456717932:web:4f8c8ae18984094b6e4049"
};

export const app = initializeApp(firebaseConfig);