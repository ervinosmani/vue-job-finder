<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// ✅ Variablat për inputet
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLogin = ref(true);

// ✅ Variablat për mesazhet
const errorMessage = ref('');
const successMessage = ref('');

// ✅ Kontrollon nëse ka një mesazh suksesi pas ridrejtimit
onMounted(() => {
  if (route.query.success) {
    successMessage.value = String(route.query.success);
    setTimeout(() => {
      successMessage.value = '';
      router.replace({ query: {} });
    }, 3000);
  }
});

// ✅ Funksioni i autentifikimit
const handleAuth = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      router.push('/jobs');
    } else {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match!';
        return;
      }

      await createUserWithEmailAndPassword(auth, email.value, password.value);
      await signOut(auth);
      window.location.href = '/login';
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
    <p v-if="successMessage" class="text-green-500 bg-green-900 p-2 rounded mb-4">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-500 bg-red-900 p-2 rounded mb-4">{{ errorMessage }}</p>

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
