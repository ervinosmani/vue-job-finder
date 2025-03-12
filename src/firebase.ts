import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 📌 Monitorojmë ndryshimet në login
const user = ref(null);
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

export { auth, user };
