import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ref } from "vue";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const user = ref(null);

onAuthStateChanged(auth, async (currentUser) => {
  user.value = currentUser;

  if (!currentUser) {
    console.log("🔄 Përdoruesi është çkyçur, po pastroj punët e ruajtura...");

    // 📌 Importo store-in vetëm kur përdoruesi del
    const { useJobStore } = await import("@/stores/jobStore");
    const jobStore = useJobStore();

    jobStore.savedJobs = [];
    localStorage.removeItem("savedJobs");
  }
});

export { auth, user, signOut };