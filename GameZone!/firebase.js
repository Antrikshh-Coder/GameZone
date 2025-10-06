import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBS2q2fqORrW2WxGaBF_WwSRYwPH98mFqA",
    authDomain: "gamezone-db.firebaseapp.com",
    projectId: "gamezone-db",
    storageBucket: "gamezone-db.appspot.com",
    messagingSenderId: "300177839069",
    appId: "1:300177839069:web:8eecee736bf57c77175c34"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
