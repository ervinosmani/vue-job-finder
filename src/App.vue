<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div id="app" class="h-screen flex flex-col">
    <Navbar />
    <router-view :key="$route.fullPath" class="flex-grow" />
  </div>
</template>
