import { defineStore } from 'pinia';
import { ref, computed, watch, watchEffect } from 'vue';
import axios from 'axios';
import { user } from '@/firebase'; // Kontrollojme nese user-i eshte kyçur

export const useJobStore = defineStore('jobStore', () => {
  const jobs = ref<any[]>([]); // Punet nga backend
  const savedJobs = ref<any[]>([]); // Inicializim i sakte pa `localStorage`
  const searchQuery = ref(''); // Kerkimi i puneve

  const loading = ref(false);
  const error = ref<string | null>(null);

  // Merr punet nga backend
  const fetchJobs = async () => {
    loading.value = true;
    try {
      const response = await axios.get("https://vue-job-api-vb9n.onrender.com/jobs");
      jobs.value = response.data; // Ruaj te gjitha fushat pa i ndryshuar
    } catch (err) {
      error.value = 'Error while fetching jobs';
      //console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // Ruaj nje pune ne te preferuarat, vetem nese user-i eshte i kyçur
  const saveJob = (job: any) => {
    if (!user.value) {
      //console.warn("Nuk mund te ruani pune pa u kyçur!");
      return;
    }

    if (!savedJobs.value.find((j) => j.id === job.id)) {
      savedJobs.value.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs.value));
    }
  };

  // Fshi nje pune nga te preferuarat
  const removeJob = (id: number) => {
    savedJobs.value = savedJobs.value.filter((job) => job.id !== id);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs.value));
  };

  // Pastrimi i puneve te ruajtura kur user-i del
  const clearSavedJobs = () => {
    savedJobs.value = [];
    localStorage.removeItem("savedJobs");
  };

  // Filtrim i puneve sipas titullit ose vendndodhjes
  const filteredJobs = computed(() => {
    return jobs.value.filter(job =>
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // Perdor `watchEffect` per te menaxhuar `savedJobs`
  watchEffect(() => {
    if (user.value) {
      // Merr punet e ruajtura nga localStorage kur user-i kyçet
      savedJobs.value = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    } else {
      // Pastron punet e ruajtura kur user-i del
      clearSavedJobs();
    }
  });

  return { 
    jobs, 
    savedJobs, 
    searchQuery, 
    loading, 
    error, 
    fetchJobs, 
    saveJob, 
    removeJob, 
    filteredJobs,
    clearSavedJobs // Funksioni per fshirjen e puneve te ruajtura
  };
});
