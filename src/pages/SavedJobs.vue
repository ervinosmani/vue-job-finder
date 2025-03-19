<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobStore';

const jobStore = useJobStore();
const router = useRouter();

// Funksion per te fshire nje pune me konfirmim
const removeJob = (id: number) => {
  if (confirm("Are you sure you want to remove this job?")) {
    jobStore.removeJob(id);
  }
};

// Funksion per te fshire te gjitha punet e ruajtura
const removeAllJobs = () => {
  if (confirm("Are you sure you want to remove all saved jobs?")) {
    jobStore.savedJobs = [];
    localStorage.removeItem('savedJobs');
    router.push('/jobs');
  }
};

// Monitorojme listen e puneve te ruajtura dhe ridrejtojme kur behet bosh
watch(() => jobStore.savedJobs.length, (newLength) => {
  if (newLength === 0) {
    router.push('/jobs');
  }
});
</script>

<template>
  <div class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-6">Saved Jobs</h1>
    <p class="text-gray-400 mb-8">Here are your saved jobs.</p>

    <!-- Butoni per te fshire te gjitha punet e ruajtura -->
    <button v-if="jobStore.savedJobs.length > 0" 
      @click="removeAllJobs"
      class="mb-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-lg">
      Remove All
    </button>

    <!-- Mesazh nese nuk ka pune te ruajtura -->
    <div v-if="jobStore.savedJobs.length === 0" class="text-gray-400">
      No saved jobs.
    </div>

    <!-- Lista e puneve te ruajtura -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="job in jobStore.savedJobs" 
        :key="job.id"
        class="bg-gray-800 p-6 rounded-lg shadow-lg text-left h-full flex flex-col justify-between min-h-[430px] border transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
      >
        <h2 class="text-2xl font-bold">{{ job.title }}</h2>
        <p class="text-gray-400"><strong>Company:</strong> {{ job.company }}</p>
        <p class="text-gray-400"><strong>Industry:</strong> {{ job.industry }}</p>
        <p class="text-gray-400"><strong>Experience Level:</strong> {{ job.experience }}</p>
        <p class="text-gray-400"><strong>Location:</strong> {{ job.location }}</p>
        <p class="text-gray-400">
          <strong>Salary:</strong> {{ job.salary ?? 'N/A' }}
        </p>

        <!-- Pershkrimi i punes -->
        <p class="text-gray-300 mt-2">
          {{ job.description.length > 100 ? job.description.slice(0, 100) + '...' : job.description }}
        </p>

        <!-- Butonat e kontrollit -->
        <div class="mt-4 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <button 
            @click="removeJob(job.id)"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full">
            Remove
          </button>

          <router-link :to="`/jobs/${job.id}`" class="w-full">
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition">
              View Details
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
