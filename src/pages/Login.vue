<script setup lang="ts">
import { ref, watch } from 'vue';
import { auth, user } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLogin = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

// ✅ Watch për ndryshimin e user-it dhe ridrejtim të sigurt
watch(user, (newUser) => {
  if (newUser) {
    console.log("✅ User u kyç, ridrejto në faqen e mëparshme...");
    const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/jobs";
    sessionStorage.removeItem("redirectAfterLogin");
    router.replace(redirectPath);
  }
});

// ✅ Funksioni i autentifikimit
const handleAuth = async () => {
  errorMessage.value = '';
  successMessage.value = ''; 

  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      successMessage.value = "✅ Login successful! Redirecting...";
    } else {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = '❌ Passwords do not match!';
        return;
      }
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      successMessage.value = "✅ Account created successfully! Redirecting to login...";
      await signOut(auth);
      setTimeout(() => {
        router.replace('/login');
      }, 500);
    }
  } catch (error: any) {
    errorMessage.value = error.message;
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

      <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        {{ isLogin ? "Login" : "Sign Up" }}
      </button>
    </form>

    <p class="text-gray-400 mt-4">
      {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
      <button @click="isLogin = !isLogin" class="text-blue-400 underline">
        {{ isLogin ? "Sign Up" : "Login" }}
      </button>
    </p>
  </div>
</template>
