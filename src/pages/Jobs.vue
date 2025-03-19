<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useJobStore } from '@/stores/jobStore';
import { user, authLoaded } from '@/firebase';
import { useRouter } from 'vue-router';

const jobStore = useJobStore();
const searchQuery = ref('');
const selectedIndustry = ref('');
const selectedExperience = ref('');
const selectedJobType = ref('');
const currentPage = ref(1);
const jobsPerPage = 6;
const router = useRouter();

onMounted(() => {
  jobStore.fetchJobs();
  nextTick(() => {
    const savedScroll = sessionStorage.getItem('scrollPosition');
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
    }
  });
});

const shortDescription = (description: string) => {
  return description.length > 50 ? description.substring(0, 50) + "..." : description;
};

const saveScrollPosition = () => {
  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
};

const clearSearch = () => {
  searchQuery.value = '';
  selectedIndustry.value = '';
  selectedExperience.value = '';
  selectedJobType.value = '';
};

// 📌 Filtrim i punëve sipas industry, experience dhe job type
const filteredJobs = computed(() => {
  return jobStore.jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesIndustry = selectedIndustry.value ? job.industry === selectedIndustry.value : true;
    const matchesExperience = selectedExperience.value ? job.experience === selectedExperience.value : true;
    const matchesJobType = selectedJobType.value ? job.location === selectedJobType.value : true;

    return matchesSearch && matchesIndustry && matchesExperience && matchesJobType;
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
    scrollToTop();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToTop();
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 📌 FUNKSIONI: Ruaj punën në të preferuarat
const handleSave = async (job: any) => {
  console.log("🛠 Kontrollojmë user për Save Job:", user.value);

  if (!authLoaded.value) {
    console.log("⏳ Duke pritur Firebase...");
    return;
  }

  if (!user.value) { 
    console.log("🔒 User nuk është i kyçur, ridrejto në login...");
    
    sessionStorage.setItem("redirectAfterLogin", router.currentRoute.value.fullPath);

    router.push("/login");
    return;
  }

  if (!isSaved(job.id)) {
    jobStore.saveJob(job);
  }
};


// ✅ Përdor watch për të siguruar që Vue reagon kur user ndryshon
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

const isSaved = (id: number) => {
  return user.value ? jobStore.savedJobs.some(job => job.id === id) : false;
};

watch([searchQuery, selectedIndustry, selectedExperience, selectedJobType], () => {
  currentPage.value = 1;
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="container mx-auto p-0 my-2 sm:p-6 text-center">
    <h1 class="text-4xl font-bold text-gray-200 mb-6">Job Listings</h1>

    <!-- 📌 Filtrat - Organizuar më mirë për desktop -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-center">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search jobs..."
        class="p-2 rounded border bg-gray-800 text-white w-full"
      />
      
      <!-- Dropdown Lists -->
<select v-model="selectedIndustry" class="p-2 rounded border bg-gray-800 text-white w-full appearance-none">
  <option value="">All Industries</option>
  <option value="IT">IT</option>
  <option value="Finance">Finance</option>
  <option value="Marketing">Marketing</option>
  <option value="Design">Design</option>
</select>

<select v-model="selectedExperience" class="p-2 rounded border bg-gray-800 text-white w-full appearance-none">
  <option value="">All Experience Levels</option>
  <option value="Junior">Junior</option>
  <option value="Mid-Level">Mid-Level</option>
  <option value="Senior">Senior</option>
</select>

<select v-model="selectedJobType" class="p-2 rounded border bg-gray-800 text-white w-full appearance-none">
  <option value="">All Types</option>
  <option value="Remote">Remote</option>
  <option value="On-site">On-site</option>
</select>


      <button
        @click="clearSearch"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition w-full md:w-auto"
      >
        Clear
      </button>
    </div>

    <!-- 📌 Lista e punëve -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      <div
        v-for="job in paginatedJobs"
        :key="job.id"
        class="job-card bg-gray-800 p-6 rounded-lg shadow-lg text-left h-full flex flex-col justify-between border min-h-[430px] transition-all duration-[0.5s] transform hover:scale-105 hover:shadow-2xl"
      >
        <h2 class="text-2xl font-bold">{{ job.title }}</h2>
        <p class="text-gray-400"><strong>Company:</strong> {{ job.company }}</p>
        <p class="text-gray-400"><strong>Industry:</strong> {{ job.industry }}</p>
        <p class="text-gray-400"><strong>Experience Level:</strong> {{ job.experience }}</p>
        <p class="text-gray-400"><strong>Location:</strong> {{ job.location }}</p>
        <p class="text-gray-400">{{ shortDescription(job.description) }}</p>

        <div class="mt-4 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            @click="handleSave(job)"
            :class="{
              'bg-gray-500 cursor-not-allowed': isSaved(job.id) && user,
              'bg-green-500 hover:bg-green-600': !isSaved(job.id) || !user
            }"
            class="px-4 py-2 text-white rounded-lg w-full transition"
            :disabled="isSaved(job.id) && user"
          >
            {{ isSaved(job.id) ? 'Saved' : 'Save Job' }}
          </button>

          <router-link :to="`/jobs/${job.id}`" class="w-full">
            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg w-full">
              View Details
            </button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 📌 Loading -->
    <div v-if="jobStore.loading" class="flex justify-center">
      <svg
        class="animate-spin h-10 w-10 text-blue-400"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
    </div>

    <!-- 📌 Error Message -->
    <div v-else-if="jobStore.error" class="text-red-400">
      {{ jobStore.error }}
    </div>

    <!-- 📌 No Jobs Found -->
    <div v-else-if="filteredJobs.length === 0" class="text-gray-400">
      No jobs found.
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 mb-4 flex justify-center items-center space-x-6">
  <button
    @click="prevPage"
    :disabled="currentPage === 1"
    class="w-28 h-12 flex items-center justify-center bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-500 text-lg"
  >
    ← Prev
  </button>

  <span class="text-gray-300 text-lg font-semibold"> Page {{ currentPage }} of {{ totalPages }} </span>

  <button
    @click="nextPage"
    :disabled="currentPage === totalPages"
    class="w-28 h-12 flex items-center justify-center bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-500 text-lg"
  >
    Next →
  </button>
</div>
  </div>
</template> 

<style scoped>
/* ✅ RREGULLIMI I DROPDOWN-IT VETËM PËR EKRANE TË VOGLA */
@media (max-width: 768px) {
  select {
    width: 100% !important;    /* ✅ Dropdown-i të jetë i njëjtë me input-in */
    max-width: 100% !important; /* ✅ Kufizon që të mos jetë më i madh */
    appearance: none !important; /* ✅ Hiq stilin e shfletuesit */
    box-sizing: border-box !important; /* ✅ Siguron që padding & border të mos ndikojnë */
    font-size: 14px !important; /* ✅ Teksti të jetë i njëjtë me input-et */
    padding: 10px !important;   /* ✅ Jep hapësirë të barabartë për tekstin */
    border: 1px solid #ccc !important; /* ✅ Jep një stil të pastër */
    background-color: #1f2937 !important; /* ✅ Ngjyrë uniforme */
    color: white !important; /* ✅ Teksti me ngjyrë të bardhë */
    border-radius: 5px !important; /* ✅ Cepa të rrumbullakosur */
  }

  /* ✅ PËR OPSIONET E DROPDOWN-IT */
  select option {
    font-size: 14px !important; /* ✅ Teksti i opsioneve i njëjtë me input-et */
    max-width: 100% !important; /* ✅ Kufizojmë opsionet */
    text-align: left !important; /* ✅ Sigurojmë që teksti të jetë i rregullt */
    background-color: #1f2937 !important; /* ✅ Ngjyrë uniforme */
    color: white !important; /* ✅ Tekst i bardhë */
  }

  /* ✅ PËR TË SIGURUAR QË DROPDOWN-I MOS DEL JASHTË */
  select:focus {
    outline: none !important; /* ✅ Hiq border-in blu të shfletuesit */
    border-color: #3b82f6 !important; /* ✅ Jep një highlight kur fokusohet */
  }

  /* ✅ KUFIZIMI I GJERËSISË SË LISTËS SË HAPUR */
  select::-webkit-scrollbar {
    width: 5px !important; /* ✅ Bën scrollbar-in më të vogël */
  }

  select::-webkit-scrollbar-thumb {
    background: #3b82f6 !important; /* ✅ Jep një ngjyrë të lehtë scrollbar-it */
    border-radius: 10px !important;
  }
}
</style>



