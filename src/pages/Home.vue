<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToJobs = () => {
  router.push('/jobs');
};
</script>

<template>
  <div class="w-full bg-gray-900 min-h-screen flex items-center justify-center px-6">
    <div class="max-w-7xl w-full text-center">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
        Find Your <span class="text-blue-400">Dream Job</span> Easily 🚀
      </h1>
      <p class="text-gray-300 text-lg md:text-xl mb-6">
        Discover thousands of job opportunities in tech, design, marketing, and more. 
        Start your career journey with <span class="text-blue-400 font-bold">Vue Job Finder</span> today!
      </p>

      <router-link to="/jobs">
        <button class="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition">
          Browse Jobs
        </button>
      </router-link>

      <!-- Ilustrimi -->
      <div class="mt-10 flex justify-center">
        <img src="/public/job-search.svg" alt="Job Search Illustration" class="w-full max-w-lg opacity-90">
      </div>
    </div>
  </div>
</template>


<style scoped>
button:hover {
  transform: scale(1.05);
}

img {
  animation: fadeIn 1.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
