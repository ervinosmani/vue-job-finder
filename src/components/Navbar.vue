<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { auth, user } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const isOpen = ref(false);
const hasScrolled = ref(false);

const handleScroll = () => {
  hasScrolled.value = window.scrollY > 50;
};

const handleLogout = async () => {
  await signOut(auth);
  router.push('/');  // Pas logout, ridrejto në faqen e Home
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <nav
    :class="['fixed top-0 w-full z-50 transition-all duration-300',
              hasScrolled ? 'bg-gray-900 shadow-lg bg-opacity-90' : 'bg-gray-800']">
    <div class="container mx-auto flex justify-between items-center px-6 py-4">
      <router-link to="/" class="text-2xl font-bold text-white">Vue Job Finder</router-link>

      <button @click="isOpen = !isOpen" class="md:hidden text-white text-3xl focus:outline-none">
        ☰
      </button>

      <ul
        :class="[ 'md:flex md:space-x-6 transition-all duration-300',
          isOpen ? 'block' : 'hidden']"
        class="absolute md:static top-16 left-0 bg-gray-900 w-full md:w-auto md:flex md:items-center text-lg"
      >
        <li><router-link to="/" class="block p-3 text-white hover:text-blue-400">Home</router-link></li>
        <li><router-link to="/jobs" class="block p-3 text-white hover:text-blue-400">Jobs</router-link></li>
        <li><router-link to="/saved-jobs" class="block p-3 text-white hover:text-blue-400">Saved Jobs</router-link></li>

        <li v-if="!user">
          <router-link to="/login" class="block p-3 text-white bg-blue-500 hover:bg-blue-600 transition rounded">
            Login
          </router-link>
        </li>
        <li v-else>
          <button @click="handleLogout" class="block p-3 text-white bg-red-500 hover:bg-red-600 transition rounded">
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>


<style scoped>
/* Sigurohemi që navbar-i të mos mbulojë përmbajtjen */
body {
  padding-top: 4rem;
}
</style>
