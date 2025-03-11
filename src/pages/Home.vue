<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[80vh] text-center">
    <h1 class="text-4xl font-bold text-blue-400">Welcome to Vue Job Finder</h1>
    <p class="text-gray-400 mt-2">Find your dream job easily!</p>
    <router-link to="/jobs"
      class="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
      Browse Jobs
    </router-link>
  </div>
</template>
