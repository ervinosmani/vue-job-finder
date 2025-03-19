<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { auth, user, authLoaded } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLogin = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const isNewUser = ref(false); // Flag per te shmangur ridrejtimin e shpejte

// Monitorimi i gjendjes se perdoruesit per ridrejtim automatik
watchEffect(() => {
  if (!user.value && authLoaded.value && isNewUser.value) {
    console.log("Perdoruesi eshte shkycur, ridrejto te login...");
    isNewUser.value = false; // Reset flag
    router.replace('/login'); 
  }
});

// Funksioni i autentifikimit
const handleAuth = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    if (isLogin.value) {
      // LOGIN
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const userEmail = userCredential.user.email;
      
      successMessage.value = `Welcome back, ${userEmail}! Redirecting...`;

      setTimeout(() => {
        router.replace("/jobs");
      }, 1000);

    } else {
      // SIGN UP
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match!';
        isLoading.value = false;
        return;
      }

      console.log("Creating user in Firebase...");
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      
      successMessage.value = "Account successfully created! Redirecting to login...";

      console.log("Signing out after account creation...");
      await signOut(auth);

      setTimeout(() => {
        router.replace('/login');
        router.go(0); // Reload for correct state update
      }, 1000);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-screen w-screen flex justify-center items-start pt-16 bg-gray-900 px-6 md:px-0 overflow-hidden">
    <div class="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-white text-center mb-6">
        {{ isLogin ? "Login" : "Sign Up" }}
      </h1>

      <!-- Mesazhi i suksesit -->
      <p v-if="successMessage" class="bg-green-600 text-white text-center px-4 py-2 rounded-md mb-4 text-sm shadow-md">
        {{ successMessage }}
      </p>

      <!-- Mesazhi i gabimit -->
      <p v-if="errorMessage" class="bg-red-600 text-white text-center px-4 py-2 rounded-md mb-4 text-sm shadow-md">
        {{ errorMessage }}
      </p>

      <form @submit.prevent="handleAuth" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email"
          class="w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />

        <input v-model="password" type="password" placeholder="Password"
          class="w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />

        <input v-if="!isLogin" v-model="confirmPassword" type="password" placeholder="Confirm Password"
          class="w-full p-3 rounded-md border border-gray-600 bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />

        <!-- Butoni me animacion Loading -->
        <button 
          type="submit" 
          class="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition disabled:bg-gray-500 flex justify-center items-center"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">{{ isLogin ? "Login" : "Sign Up" }}</span>
          <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </button>
      </form>

      <p class="text-gray-400 mt-6 text-center text-sm">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button @click="isLogin = !isLogin" class="text-blue-400 underline ml-1">
          {{ isLogin ? "Sign Up" : "Login" }}
        </button>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Heq scroll vetem per `Login.vue` dhe `SignUp.vue`, jo per gjithe aplikacionin */
.overflow-hidden {
  overflow: hidden;
}
</style>
