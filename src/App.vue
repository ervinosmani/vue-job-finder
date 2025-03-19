<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { onMounted } from 'vue';

onMounted(() => {
  document.documentElement.classList.add('dark'); 
});
</script>

<template>
  <div id="app" class="h-screen flex flex-col">
    <Navbar />
    <router-view :key="$route.fullPath" class="flex-grow" />
  </div>
</template>

<style scoped>
#app {
  padding: 1.3rem;
  margin: 20px 0;
}
</style>