<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobStore';

const jobStore = useJobStore();
const router = useRouter();

// 📌 Funksion për të fshirë një punë me konfirmim
const removeJob = (id: number) => {
  const confirmDelete = confirm("Are you sure you want to remove this job?");
  if (confirmDelete) {
    jobStore.removeJob(id);
  }
};

// 📌 Funksion për të fshirë të gjitha punët e ruajtura
const removeAllJobs = () => {
  const confirmDeleteAll = confirm("Are you sure you want to remove all saved jobs?");
  if (confirmDeleteAll) {
    jobStore.savedJobs = [];
    localStorage.removeItem('savedJobs');
  }
};

// 📌 Monitorojmë listën e punëve të ruajtura dhe ridrejtojmë kur lista bëhet bosh
watch(() => jobStore.savedJobs.length, (newLength) => {
  if (newLength === 0) {
    router.push('/jobs'); // 📌 Mund ta ndryshosh në '/home' nëse dëshiron të shkojë atje
  }
});
</script>

<template>
  <div class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-6">Saved Jobs</h1>
    <p class="text-gray-400 mb-8">Here are your saved jobs.</p>

    <!-- 📌 Butoni për të fshirë të gjitha punët e ruajtura -->
    <button v-if="jobStore.savedJobs.length > 0" @click="removeAllJobs"
      class="mb-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
      Remove All
    </button>

    <div v-if="jobStore.savedJobs.length === 0" class="text-gray-400">
      No saved jobs.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="job in jobStore.savedJobs" :key="job.id"
        class="bg-gray-800 p-6 rounded-lg shadow-lg text-left h-full flex flex-col justify-between min-h-[350px] border">

        <h2 class="text-xl font-bold">{{ job.title }}</h2>
        <p class="text-gray-400 mt-2 flex-1">{{ job.body }}</p>
        <p class="text-gray-400"><strong>Location:</strong> {{ job.location }}</p>

        <div class="pt-4 flex space-x-2">
          <button @click="removeJob(job.id)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Remove
          </button>

          <router-link :to="`/jobs/${job.id}`" @click="setPreviousPage">
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              View Details
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
