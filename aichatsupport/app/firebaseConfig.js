// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-UdaTLSgnSqt4H6Y0KR5fOvZi_ppd06U",
  authDomain: "ai-robotchat.firebaseapp.com",
  projectId: "ai-robotchat",
  storageBucket: "ai-robotchat.appspot.com",
  messagingSenderId: "911733738944",
  appId: "1:911733738944:web:9cf7a04101929dbca14c25",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
