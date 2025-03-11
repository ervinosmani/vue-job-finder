<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const hasScrolled = ref(false);

const handleScroll = () => {
  hasScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>


<template>
  <nav :class="['fixed top-0 w-full z-50 transition-all duration-300',
              hasScrolled ? 'bg-gray-900 shadow-lg bg-opacity-90' : 'bg-gray-800']">
    <div class="container mx-auto flex justify-between items-center px-6 py-4">
      <h1 class="text-2xl font-bold">Vue Job Finder</h1>

      <!-- Butoni për mobile -->
      <button @click="isOpen = !isOpen" class="md:hidden text-white text-3xl focus:outline-none">
        ☰
      </button>

      <!-- Menuja -->
      <ul
        :class="[
          'md:flex md:space-x-6 transition-all duration-300',
          isOpen ? 'block' : 'hidden'
        ]"
        class="absolute md:static top-16 left-0 bg-gray-900 w-full md:w-auto md:flex md:items-center text-lg"
      >
        <li>
          <router-link to="/" class="block p-3 hover:text-blue-400 transition">Home</router-link>
        </li>
        <li>
          <router-link to="/jobs" class="block p-3 hover:text-blue-400 transition">Jobs</router-link>
        </li>
        <li>
          <router-link to="/saved" class="block p-3 hover:text-blue-400 transition">Saved Jobs</router-link>
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
