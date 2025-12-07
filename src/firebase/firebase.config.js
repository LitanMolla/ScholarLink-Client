import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBw0CzLp8IkLI4Nzjie7pb3PzKM47sXI5Q",
  authDomain: "scholarlink-9caf2.firebaseapp.com",
  projectId: "scholarlink-9caf2",
  storageBucket: "scholarlink-9caf2.firebasestorage.app",
  messagingSenderId: "331458197394",
  appId: "1:331458197394:web:529309dd125bb8bef4f34b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
