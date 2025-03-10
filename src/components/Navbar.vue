<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
</script>

<template>
  <nav class="bg-gray-800 text-white fixed top-0 w-full shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center p-4">
      <h1 class="text-2xl font-bold">Vue Job Finder</h1>

      <!-- Butoni për menynë në ekranet e vogla -->
      <button @click="isOpen = !isOpen" class="md:hidden text-white text-3xl">
        ☰
      </button>

      <!-- Menuja -->
      <ul
        :class="[
          'md:flex md:space-x-6',
          isOpen ? 'block' : 'hidden'
        ]"
        class="absolute md:static top-16 left-0 bg-gray-800 w-full md:w-auto md:flex md:items-center text-lg"
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
/* Shtojmë hapësirë poshtë navbar-it */
body {
  padding-top: 4rem;
}

/* Bën që Navbar-i të qëndrojë në krye */
nav {
  z-index: 1000;
}
</style>
