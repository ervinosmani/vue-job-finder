import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ref } from "vue";

const firebaseConfig = {
  apiKey: "AIzaSyCt-deJVmDsVjcpqEeTsmwuGDKhVFkFREM",
  authDomain: "vue-job-finder.firebaseapp.com",
  projectId: "vue-job-finder",
  storageBucket: "vue-job-finder.firebasestorage.app",
  messagingSenderId: "589648708727",
  appId: "1:589648708727:web:188693d72947ee89373272",
  measurementId: "G-1KNMR19357"
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