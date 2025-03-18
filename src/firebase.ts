import { ref, watchEffect } from "vue";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  setPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import type { User } from "firebase/auth";
import { useJobStore } from "@/stores/jobStore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const user = ref<User | null>(null);
const authLoaded = ref(false);

// ✅ Përdorim `browserSessionPersistence` për të mbajtur user-in vetëm gjatë sesionit
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("❌ Gabim gjatë vendosjes së persistence:", error);
});

// 🔥 Event listener për ndryshimin e autentifikimit
onAuthStateChanged(auth, async (currentUser) => {
  console.log("🔥 Auth State Changed:", currentUser);

  const jobStore = useJobStore();

  if (currentUser) {
    user.value = currentUser;
    sessionStorage.setItem("user", JSON.stringify(currentUser));
  } else {
    user.value = null;
    sessionStorage.removeItem("user");

    // ✅ Pastron punët e ruajtura kur user del
    jobStore.savedJobs = [];
    localStorage.removeItem("savedJobs");
  }

  authLoaded.value = true;
});

// ✅ Funksioni i logout që gjithmonë ridrejton në Home
const handleLogout = async (router: any) => {
  await signOut(auth);
  router.replace('/'); // ✅ Ridrejto në Home pas logout
};

export { auth, user, signOut, authLoaded, handleLogout };
