<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobStore';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const jobStore = useJobStore();

const job = ref<any>(null);
const showRedirectMessage = ref(false); // 📌 Për mesazhin "Redirecting to LinkedIn..."

onMounted(async () => {
  const jobId = Number(route.params.id);
  
  // **Përpiqemi ta gjejmë punën nga store**
  job.value = jobStore.jobs.find(j => j.id === jobId);

  // **Nëse punët nuk janë ngarkuar ende, bëjmë një kërkesë tek backend**
  if (!job.value) {
    try {
      const response = await axios.get(`http://localhost:3000/jobs/${jobId}`);
      job.value = response.data;
    } catch (err) {
      console.error("Job not found:", err);
      router.push('/jobs'); // Nëse puna nuk gjendet, ridrejtohet te Jobs
    }
  }
});

// 📌 FUNKSIONI: Apliko për punë
const applyForJob = () => {
  if (job.value?.applyLink) {
    showRedirectMessage.value = true; // Shfaq mesazhin

    // Hap LinkedIn në një tab të ri pas 1 sekonde
    setTimeout(() => {
      window.open(job.value.applyLink, '_blank');
    }, 1000);

    // Fshih mesazhin pas 3 sekondash
    setTimeout(() => {
      showRedirectMessage.value = false;
    }, 3000);
  } else {
    alert("This job does not have an application link.");
  }
};

// 📌 FUNKSIONI: Kthehu pas te Jobs pa humbur scroll-in
const goBack = () => {
  router.push('/jobs'); // Kthehet tek Jobs
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Kthen faqen në fillim
  }, 100);
};
</script>

<template>
  <div v-if="job" class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-4">{{ job.title }}</h1>
    <p class="text-gray-400 mb-4">{{ job.body }}</p>

    <p class="text-gray-400"><strong>Company:</strong> {{ job.company }}</p>
    <p class="text-gray-400"><strong>Location:</strong> {{ job.location }}</p>
    <p class="text-gray-400"><strong>Salary:</strong> {{ job.salary }}</p>

    <div class="mt-6 flex flex-col items-center space-y-4">
      <button @click="applyForJob" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
        Apply Now
      </button>

      <!-- 📌 Mesazhi që shfaqet për pak sekonda pas klikimit -->
      <p v-if="showRedirectMessage" class="text-yellow-400 text-lg font-semibold">
        🔄 Redirecting to LinkedIn...
      </p>

      <button @click="goBack" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        ← Back to Jobs
      </button>
    </div>
  </div>

  <div v-else class="text-center text-gray-400">Loading job details...</div>
</template>
