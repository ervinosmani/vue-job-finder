<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobStore';
import { user, authLoaded } from '@/firebase';
import axios from 'axios';
import { nextTick } from "vue";

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
    window.open(job.value.applyLink, '_blank');
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
  <div v-if="job" class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-4">{{ job.title }}</h1>
    <p class="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
      {{ job.description }}
    </p>

    <p class="text-gray-400"><strong>Company:</strong> {{ job.company }}</p>
    <p class="text-gray-400"><strong>Salary:</strong> {{ job.salary }}</p>
    <p class="text-gray-400"><strong>Location:</strong> {{ job.location }}</p>
    <p class="text-gray-400"><strong>Industry:</strong> {{ job.industry }}</p>
    <p class="text-gray-400"><strong>Experience Level:</strong> {{ job.experience }}</p>

    <div class="mt-6 flex flex-col items-center space-y-4">
      <button @click="applyForJob" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
        Apply Now
      </button>

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
