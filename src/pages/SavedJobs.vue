<script setup lang="ts">
import { useJobStore } from '@/stores/jobStore';

const jobStore = useJobStore();

const removeJob = (id: number) => {
  jobStore.removeJob(id);
};
</script>

<template>
  <div class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-6">Saved Jobs</h1>
    <p class="text-gray-400 mb-8">Here are your saved jobs.</p>

    <div v-if="jobStore.savedJobs.length === 0" class="text-gray-400">No saved jobs yet.</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="job in jobStore.savedJobs" :key="job.id" class="bg-gray-800 p-6 rounded-lg shadow-lg text-left h-full flex flex-col justify-between min-h-[350px]">
        <h2 class="text-xl font-bold">{{ job.title }}</h2>
        <p class="text-gray-400 mt-2 flex-1">{{ job.body }}</p>
        
        <div class="pt-4 flex space-x-2">
          <button @click="removeJob(job.id)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Remove
          </button>
          <router-link :to="`/jobs/${job.id}`">
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              View Details
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
