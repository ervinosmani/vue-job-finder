import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { ref, watchEffect } from "vue";
import { useJobStore } from "@/stores/jobStore"; // ✅ Importo jobStore për të pastruar punët e ruajtura

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

onAuthStateChanged(auth, async (currentUser) => {
  console.log("🔥 Auth State Changed:", currentUser);
  
  const jobStore = useJobStore(); // ✅ Merr jobStore për të pastruar punët e ruajtura

  if (currentUser) {
    user.value = currentUser;
    localStorage.setItem("user", JSON.stringify(currentUser));
  } else {
    user.value = null;
    localStorage.removeItem("user");

    // ✅ PASTRO punët e ruajtura kur user del!
    jobStore.savedJobs = [];
    localStorage.removeItem("savedJobs");
  }

  authLoaded.value = true;
});

// ✅ Kontrollojmë ndryshimin e user-it dhe ridrejtojmë në login nëse user-i del
watchEffect(() => {
  if (!user.value) {
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      sessionStorage.removeItem("redirectAfterLogin");
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);
    }
  }
});

export { auth, user, signOut, authLoaded };
