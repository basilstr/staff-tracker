import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";

const debugMode = JSON.parse(import.meta.env.VITE_DEBUG_NETWORK);

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація аутентифікації
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Вхід через Google
const loginWithGoogle = async (googleToken) => {
    try {
        const result = await signInWithPopup(auth, provider);
        googleToken.value = await result.user.getIdToken()
        if(debugMode) console.log("Успішний вхід:");
    } catch (error) {
        googleToken.value = ''
        if(debugMode) console.error("Помилка входу:", error);
    }
};

// Вихід
const logout = async (googleToken = null) => {
    await signOut(auth);
    localStorage.removeItem("token");
    if(googleToken) googleToken.value = ''
    if(debugMode) console.log("Користувач вийшов");
};


export { auth, provider, loginWithGoogle, logout };
