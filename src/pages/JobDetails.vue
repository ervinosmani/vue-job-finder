<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobStore';

const route = useRoute();
const router = useRouter();
const jobStore = useJobStore();

const job = ref<any>(null);

onMounted(() => {
  const jobId = Number(route.params.id);
  job.value = jobStore.jobs.find(j => j.id === jobId);
});

// 📌 Kthen përdoruesin prapa dhe rikthen scroll-in në vendin e mëparshëm
const goBack = () => {
  router.push('/jobs').then(() => {
    setTimeout(() => {
      const savedScroll = sessionStorage.getItem('scrollPosition');
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll)); // Rikthen pozicionin e mëparshëm të scroll-it
      }
    }, 100);
  });
};
</script>

<template>
  <div v-if="job" class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-4">{{ job.title }}</h1>
    <p class="text-gray-400 mb-4">{{ job.body }}</p>

    <p class="text-gray-400"><strong>Company:</strong> {{ job.company }}</p>
    <p class="text-gray-400"><strong>Location:</strong> {{ job.location }}</p>
    <p class="text-gray-400"><strong>Salary:</strong> ${{ job.salary.toLocaleString() }}</p>

    <div class="mt-6 flex justify-center space-x-4">
      <button class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
        Apply Now
      </button>
      <button 
        @click="goBack"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        ← Back to Jobs
      </button>
    </div>
  </div>
  
  <div v-else class="text-center text-gray-400">Loading job details...</div>
</template>
