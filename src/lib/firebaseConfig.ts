// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZt9w4jNRBDLNhtWE_0CCy9d1WH9sKd7g",
  authDomain: "testapp-dd8f2.firebaseapp.com",
  databaseURL: "https://testapp-dd8f2.firebaseio.com",
  projectId: "testapp-dd8f2",
  storageBucket: "testapp-dd8f2.firebasestorage.app",
  messagingSenderId: "1010045783345",
  appId: "1:1010045783345:web:2e5a71000139eadbb23410"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);