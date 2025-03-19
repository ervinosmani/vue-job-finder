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

// 📌 FUNKSIONI: Apliko për punë
const applyForJob = async () => {
  console.log("🛠 Kontrollojmë user për Apply Now:", user.value);

  if (!authLoaded.value) {
    console.log("⏳ Firebase nuk është gati ende...");
    return;
  }

  if (!user.value) { 
    console.log("🔒 User nuk është i kyçur, ridrejto në login...");
    
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

// ✅ Përdor `watch` për të siguruar që ridrejtimi pas kyçjes të ndodhë
watch(user, (newUser) => {
  if (newUser) {
    console.log("✅ User u kyç, kontrollo ridrejtimin...");
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      sessionStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    }
  }
});

// 📌 FUNKSIONI: Kthehu pas te Jobs pa humbur scroll-in
const goBack = () => {
  router.push('/jobs');
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
};
</script>

<template>
  <div v-if="job" class="container mx-auto p-0 my-4 sm:p-6 text-center">
    <div class="max-w-4xl mx-auto bg-gray-900 p-6 sm:p-8 rounded-lg shadow-xl border border-gray-700">
      <h1 class="text-3xl sm:text-4xl font-bold text-white mb-4">{{ job.title }}</h1>
      
      <p class="text-gray-300 text-lg leading-relaxed mb-6 px-2 sm:px-6">
        {{ job.description }}
      </p>

      <!-- 📌 Informacioni i punës në format të pastër -->
      <div class="text-left text-gray-300 space-y-3 border-t border-gray-700 pt-4">
        <p><span class="font-semibold text-white">Company:</span> {{ job.company }}</p>
        <p><span class="font-semibold text-white">Location:</span> {{ job.location }}</p>
        <p><span class="font-semibold text-white">Industry:</span> {{ job.industry }}</p>
        <p><span class="font-semibold text-white">Experience Level:</span> {{ job.experience }}</p>
        <p><span class="font-semibold text-white">Salary:</span> {{ job.salary ?? 'N/A' }}</p>
      </div>

      <!-- 📌 Butonat e veprimit -->
      <div class="mt-2 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button 
          @click="applyForJob" 
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-lg shadow-md w-full sm:w-auto"
        >
          Apply Now
        </button>

        <button 
          @click="goBack" 
          class="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-lg shadow-md w-full sm:w-auto"
        >
          ← Back to Jobs
        </button>
      </div>

      <!-- 🔄 Mesazhi i ridrejtimit -->
      <p v-if="showRedirectMessage" class="text-yellow-400 text-lg font-semibold mt-4">
        🔄 Redirecting to LinkedIn...
      </p>
    </div>
  </div>

  <!-- 📌 Mesazh për ngarkim -->
  <div v-else class="text-center text-gray-400 text-xl mt-12">Loading job details...</div>
</template>
