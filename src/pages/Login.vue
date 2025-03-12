<script setup lang="ts">
import { ref } from 'vue';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLogin = ref(true); // 📌 Nëse është `true`, shfaqet login; nëse `false`, shfaqet signup

const handleAuth = async () => {
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      alert('Login successful!');
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      alert('Signup successful!');
    }
    router.push('/jobs'); // 📌 Pasi të kyçet, ridrejtoje përdoruesin te Jobs
  } catch (error: any) {
    alert(error.message);
  }
};
</script>

<template>
  <div class="container mx-auto p-6 text-center">
    <h1 class="text-3xl font-bold text-gray-200 mb-6">
      {{ isLogin ? "Login" : "Sign Up" }}
    </h1>

    <form @submit.prevent="handleAuth" class="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <input v-model="email" type="email" placeholder="Email"
        class="w-full p-2 mb-4 rounded border bg-gray-900 text-white" required />
      <input v-model="password" type="password" placeholder="Password"
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
