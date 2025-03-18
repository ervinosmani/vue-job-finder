<script setup lang="ts">
import { ref, watch } from 'vue';
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
const isNewUser = ref(false); // 🚀 Flag për të shmangur ridrejtimin e shpejtë

// ✅ Monitorojmë user-in për të shmangur ridrejtimin e dyfishtë pas `Sign Up`
watch(user, (newUser) => {
  if (newUser && !isNewUser.value && authLoaded.value) {
    console.log("✅ User u kyç, ridrejto në faqen e mëparshme...");
    const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/jobs";
    sessionStorage.removeItem("redirectAfterLogin");

    setTimeout(() => {
      router.replace(redirectPath);
    }, 500);
  }
});

// ✅ Funksioni i autentifikimit
const handleAuth = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true; // 🟢 Vendosim `loading` në `true` para fillimit të procesit

  try {
    if (isLogin.value) {
      // ✅ LOGIN
      await signInWithEmailAndPassword(auth, email.value, password.value);
      successMessage.value = "✅ Login successful! Redirecting..."; 

      const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/jobs";
      sessionStorage.removeItem("redirectAfterLogin");

      setTimeout(() => {
        isLoading.value = false;
        router.replace(redirectPath);
      }, 500);

    } else {
      // ✅ SIGN UP
      if (password.value !== confirmPassword.value) {
        errorMessage.value = '❌ Passwords do not match!';
        isLoading.value = false;
        return;
      }

      isNewUser.value = true; // 🚀 Parandalojmë ridrejtimin e shpejtë pas `Sign Up`
      console.log("🚀 Krijimi i user-it në Firebase...");

      await createUserWithEmailAndPassword(auth, email.value, password.value);
      successMessage.value = "✅ Account created successfully! Redirecting to login...";

      console.log("🔄 Sign out pas krijimit të user-it...");
      await signOut(auth);

      setTimeout(() => {
        isNewUser.value = false;
        isLoading.value = false;
        router.replace('/login'); // 🚀 Në vend të `reload`, përdor `router.replace`
      }, 1000);
    }
  } catch (error: any) {
    console.error("❌ Gabim:", error.message);
    errorMessage.value = error.message;
    isNewUser.value = false;
  } finally {
    isLoading.value = false; // ✅ Sigurohemi që `isLoading` të ndalojë në fund
  }
};
</script>

<template>
  <div class="container mx-auto p-6 text-center">
    <h1 class="text-3xl font-bold text-gray-200 mb-6">
      {{ isLogin ? "Login" : "Sign Up" }}
    </h1>

    <!-- ✅ Mesazhet -->
    <p v-if="successMessage" class="text-green-500 bg-green-900 p-2 rounded mb-4">
      {{ successMessage }}
    </p>
    <p v-if="errorMessage" class="text-red-500 bg-red-900 p-2 rounded mb-4">
      {{ errorMessage }}
    </p>

    <form @submit.prevent="handleAuth" class="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <input v-model="email" type="email" placeholder="Email"
        class="w-full p-2 mb-4 rounded border bg-gray-900 text-white" required />

      <input v-model="password" type="password" placeholder="Password"
        class="w-full p-2 mb-4 rounded border bg-gray-900 text-white" required />

      <input v-if="!isLogin" v-model="confirmPassword" type="password" placeholder="Confirm Password"
        class="w-full p-2 mb-4 rounded border bg-gray-900 text-white" required />

      <!-- ✅ Butoni me animacion Loading -->
      <button 
        type="submit" 
        class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-500"
        :disabled="isLoading"
      >
        {{ isLoading ? "" : (isLogin ? "Login" : "Sign Up") }}
      </button>

    </form>

    <p class="text-gray-400 mt-4">
      {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
      <button @click="isLogin = !isLogin" class="text-blue-400 underline">
        {{ isLogin ? "Sign Up" : "Login" }}
      </button>
    </p>

    <!-- ✅ Animacioni i `loading` -->
    <div v-if="isLoading" class="flex justify-center mt-4">
      <svg class="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>
  </div>
</template>
