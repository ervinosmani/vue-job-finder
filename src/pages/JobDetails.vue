<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobStore';
import { user, authLoaded } from '@/firebase';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const jobStore = useJobStore();
const job = ref<any>(null);
const showRedirectMessage = ref(false);

onMounted(async () => {
  const jobId = Number(route.params.id);
  
  job.value = jobStore.jobs.find(j => j.id === jobId);

  if (!job.value) {
    try {
      const response = await axios.get(`https://vue-job-api-vb9n.onrender.com/jobs/${jobId}`);
      job.value = response.data;
    } catch (err) {
      console.error("Job not found:", err);
      router.push('/jobs');
    }
  }
});

// FUNKSIONI: Apliko per pune
const applyForJob = async () => {
  if (!authLoaded.value) return;
  
  if (!user.value) { 
    sessionStorage.setItem("redirectAfterLogin", router.currentRoute.value.fullPath);
    router.push("/login");
    return;
  }

  if (job.value?.applyLink) {
    showRedirectMessage.value = true;
    setTimeout(() => {
      window.open(job.value.applyLink, '_blank');
      showRedirectMessage.value = false;
    }, 1000);
  } else {
    alert("This job does not have an application link.");
  }
};

// Monitoro user per ridrejtim pas login
watch(user, (newUser) => {
  if (newUser) {
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    }
  }
});

// Kthehu pas te Jobs
const goBack = () => {
  router.push('/jobs');
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
};
</script>

<template>
  <div v-if="job" class="container mx-auto p-0 my-6 sm:p-6 text-center pb-24">
    <h1 class="text-4xl font-bold text-gray-200 mb-6">Job Details</h1>

    <!-- Karta e punes me dizajnin e permiresuar -->
    <div class="max-w-3xl mx-auto bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg text-left flex flex-col justify-between border min-h-[350px] transition-all duration-500 transform hover:scale-105 hover:shadow-2xl mb-6">
      <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">{{ job.title }}</h2>

      <p class="text-gray-300 text-md leading-relaxed mb-4 px-2 sm:px-4">
        {{ job.description }}
      </p>

      <!-- Informacioni i punes -->
      <div class="text-left text-gray-300 space-y-2 border-t border-gray-700 pt-3">
        <p><strong class="text-white">Company:</strong> {{ job.company }}</p>
        <p><strong class="text-white">Location:</strong> {{ job.location }}</p>
        <p><strong class="text-white">Industry:</strong> {{ job.industry }}</p>

        <!-- Experience Level ne te djathte -->
        <div class="flex justify-between">
          <p><strong class="text-white">Experience Level:</strong> {{ job.experience }}</p>
        </div>

        <!-- Salary poshte si me pare -->
        <p><strong class="text-white">Salary:</strong> {{ job.salary ?? 'N/A' }}</p>
      </div>

      <!-- Butonat e veprimit -->
      <div class="mt-4 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        <button 
          @click="applyForJob" 
          class="px-4 py-2 text-white rounded-lg w-full sm:w-auto text-base shadow-md 
                 transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600
                 hover:from-green-600 hover:to-green-700 hover:scale-105"
        >
          Apply Now
        </button>

        <button 
          @click="goBack" 
          class="px-4 py-2 text-white rounded-lg w-full sm:w-auto text-base shadow-md 
                 transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600
                 hover:from-blue-600 hover:to-blue-700 hover:scale-105"
        >
          ← Back to Jobs
        </button>
      </div>

      <!-- Mesazhi i ridrejtimit -->
      <p v-if="showRedirectMessage" class="text-yellow-400 text-lg font-semibold mt-4">
        Redirecting to LinkedIn...
      </p>
    </div>
  </div>

  <!-- Mesazh per ngarkim -->
  <div v-else class="text-center text-gray-400 text-xl mt-12">Loading job details...</div>
</template>

<style scoped>
/* Pershtatja per ekrane te vogla */
@media (max-width: 768px) {
  .job-card {
    min-height: 350px; /* Siguron qe kartat te kene te njejten lartesi me te vogel */
  }

  /* Sigurojme qe Experience Level & Salary te jene njera mbi tjetren ne mobile */
  .flex {
    flex-direction: column;
  }
}
</style>
