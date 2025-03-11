<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useJobStore } from '@/stores/jobStore';

const jobStore = useJobStore();
const searchQuery = ref('');
const selectedCompany = ref('');
const selectedSalaryRange = ref('');
const selectedJobType = ref('');

// 📌 Rikthen pozicionin e scroll-it kur kthehemi te Jobs.vue
onMounted(() => {
  jobStore.fetchJobs();
  nextTick(() => {
    const savedScroll = sessionStorage.getItem('scrollPosition');
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
    }
  });
});

// 📌 Ruaj pozicionin e scroll-it kur klikohet një punë
const saveScrollPosition = () => {
  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
};

// Funksion për të pastruar kërkimin
const clearSearch = () => {
  searchQuery.value = '';
};

// Filtrim i punëve bazuar në input
const filteredJobs = computed(() => {
  return jobStore.jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCompany = selectedCompany.value ? job.company === selectedCompany.value : true;
    const matchesJobType = selectedJobType.value ? job.location === selectedJobType.value : true;
    const matchesSalary =
      selectedSalaryRange.value === 'low' ? job.salary < 50000 :
      selectedSalaryRange.value === 'medium' ? job.salary >= 50000 && job.salary <= 100000 :
      selectedSalaryRange.value === 'high' ? job.salary > 100000 : true;

    return matchesSearch && matchesCompany && matchesJobType && matchesSalary;
  });
});

// Merr kompanitë unike për filtrimin
const uniqueCompanies = computed(() => {
  return [...new Set(jobStore.jobs.map(job => job.company))];
});

// Funksion për të ruajtur një punë
const saveJob = (job: any) => {
  jobStore.saveJob(job);
};

// Kontrollon nëse një punë është ruajtur
const isSaved = (id: number) => {
  return jobStore.savedJobs.some(job => job.id === id);
};
</script>

<template>
  <div class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-6">Job Listings</h1>
    <p class="text-gray-400 mb-8">Browse available job opportunities.</p>

    <!-- Filtrat -->
    <div class="flex flex-wrap space-x-4 mb-4 justify-center">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search jobs..." 
        class="p-2 rounded border bg-gray-800 text-white"
      />
      <button 
        @click="clearSearch"
        class="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Clear
      </button>

      <select v-model="selectedCompany" class="p-2 rounded border bg-gray-800 text-white">
        <option value="">All Companies</option>
        <option v-for="company in uniqueCompanies" :key="company" :value="company">
          {{ company }}
        </option>
      </select>

      <select v-model="selectedSalaryRange" class="p-2 rounded border bg-gray-800 text-white">
        <option value="">All Salaries</option>
        <option value="low">Below $50,000</option>
        <option value="medium">$50,000 - $100,000</option>
        <option value="high">Above $100,000</option>
      </select>

      <select v-model="selectedJobType" class="p-2 rounded border bg-gray-800 text-white">
        <option value="">All Types</option>
        <option value="Remote">Remote</option>
        <option value="On-site">On-site</option>
      </select>
    </div>

    <!-- Mesazhet e gjendjes -->
    <div v-if="jobStore.loading" class="text-blue-400">Loading jobs...</div>
    <div v-else-if="jobStore.error" class="text-red-400">{{ jobStore.error }}</div>
    <div v-else-if="filteredJobs.length === 0" class="text-gray-400">No jobs found.</div>

    <!-- Lista e punëve -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="job in filteredJobs" :key="job.id" 
        class="bg-gray-800 p-6 rounded-lg shadow-lg text-left h-full flex flex-col justify-between min-h-[350px] border"
        :class="{ 'border-green-500': isSaved(job.id) }">
        
        <h2 class="text-xl font-bold">{{ job.title }}</h2>
        <p class="text-gray-400 mt-2 flex-1">{{ job.body }}</p>
        <p class="text-gray-400"><strong>Location:</strong> {{ job.location }}</p>

        <div class="pt-4 flex space-x-2">
          <button @click="saveJob(job)" class="px-4 py-2 rounded-lg transition bg-green-500 hover:bg-green-600 text-white">
            Save Job
          </button>
          <router-link :to="`/jobs/${job.id}`" @click="saveScrollPosition">
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              View Details
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
