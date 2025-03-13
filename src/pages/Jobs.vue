<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useJobStore } from '@/stores/jobStore';
import { watch } from 'vue';
import { user } from '@/firebase';
import { useRouter } from 'vue-router';

const jobStore = useJobStore();
const searchQuery = ref('');
const selectedSalaryRange = ref('');
const selectedJobType = ref('');
const currentPage = ref(1);
const jobsPerPage = 6;
const router = useRouter();

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

// 📌 Filtrim i punëve
const filteredJobs = computed(() => {
  return jobStore.jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesJobType = selectedJobType.value ? job.location === selectedJobType.value : true;
    const matchesSalary =
      selectedSalaryRange.value === 'low' ? job.salary < 50000 :
        selectedSalaryRange.value === 'medium' ? job.salary >= 50000 && job.salary <= 100000 :
          selectedSalaryRange.value === 'high' ? job.salary > 100000 : true;

    return matchesSearch && matchesJobType && matchesSalary;
  });
});

// 📌 Pagination
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  return filteredJobs.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / jobsPerPage));

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToTop(); // 📌 Kthehet lart kur ndërrohet faqja
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToTop(); // 📌 Kthehet lart kur ndërrohet faqja
  }
};

// 📌 Funksion që e kthen faqen lart
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 📌 Funksioni për të ruajtur një punë
const handleSave = (job: any) => {
  if (!user.value) {
    sessionStorage.setItem("redirectAfterLogin", "/jobs");
    router.push('/login');
    return;
  }
  jobStore.saveJob(job);
};

// 📌 Kontrollon nëse një punë është ruajtur
const isSaved = (id: number) => {
  return user.value ? jobStore.savedJobs.some(job => job.id === id) : false;
};

watch([searchQuery, selectedSalaryRange, selectedJobType], () => {
  currentPage.value = 1; // Rikthehet në faqen e parë
  window.scrollTo(0, 0); // Kthen faqen lart
});
</script>

<template>
  <div class="container mx-auto p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-6">Job Listings</h1>
    <p v-if="user" class="text-green-400 mb-4">Welcome back, {{ user.email }}!</p>

    <!-- Filtrat -->
    <div class="flex flex-wrap space-x-4 mb-4 justify-center">
      <input v-model="searchQuery" type="text" placeholder="Search jobs..."
        class="p-2 rounded border bg-gray-800 text-white" />
      <button @click="clearSearch" class="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
        Clear
      </button>

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

    <!-- Loading Spinner -->
    <div v-if="jobStore.loading" class="flex justify-center">
      <svg class="animate-spin h-10 w-10 text-blue-400" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>

    <div v-else-if="jobStore.error" class="text-red-400">{{ jobStore.error }}</div>
    <div v-else-if="filteredJobs.length === 0" class="text-gray-400">No jobs found.</div>

    <!-- Lista e punëve -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="job in paginatedJobs" :key="job.id"
        class="bg-gray-800 p-6 rounded-lg shadow-lg text-left h-full flex flex-col justify-between min-h-[350px] border transition-transform hover:scale-105 hover:shadow-xl"
        :class="{ 'border-green-500': isSaved(job.id) }">

        <h2 class="text-xl font-bold">{{ job.title }}</h2>
        <p class="text-gray-400"><strong>Company:</strong> {{ job.company }}</p>
        <p class="text-gray-400"><strong>Location:</strong> {{ job.location }}</p>
        <p class="text-gray-400"><strong>Salary:</strong> {{ job.salary }}</p>

        <!-- 📌 Përshkrimi i punës -->
        <p class="text-gray-300 mt-2">
          {{ job.description.length > 100 ? job.description.slice(0, 100) + '...' : job.description }}
        </p>

        <!-- Butonat -->
        <div class="mt-4 flex justify-between space-x-2">
          <button @click="handleSave(job)" class="px-4 py-2 rounded-lg transition text-white w-full" :class="{
            'bg-green-500 text-white': !user,
            'bg-green-500 hover:bg-green-600 text-white': user && !isSaved(job.id),
            'bg-gray-600 text-white': user && isSaved(job.id)
          }">
            {{ user && isSaved(job.id) ? 'Saved' : 'Save Job' }}
          </button>

          <router-link :to="`/jobs/${job.id}`" @click="saveScrollPosition" class="w-full">
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full">
              View Details
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 📌 Pagination -->
<div v-if="totalPages > 1" class="mt-6 flex justify-center space-x-4">
  <button @click="prevPage" :disabled="currentPage === 1"
    class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-500">
    ← Previous
  </button>

  <span class="text-gray-300 text-lg"> Page {{ currentPage }} of {{ totalPages }} </span>

  <button @click="nextPage" :disabled="currentPage === totalPages"
    class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-500">
    Next →
  </button>
</div>
  </div>
</template>
