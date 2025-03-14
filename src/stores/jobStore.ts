import { defineStore } from 'pinia';
import { ref, computed, watch, watchEffect } from 'vue';
import axios from 'axios';
import { user } from '@/firebase'; // ✅ Kontrollojmë nëse user-i është kyçur

export const useJobStore = defineStore('jobStore', () => {
  const jobs = ref<any[]>([]); // Punët nga backend
  const savedJobs = ref<any[]>([]); // ✅ Inicializim i saktë pa `localStorage`
  const searchQuery = ref(''); // ✅ Kërkimi i punëve

  const loading = ref(false);
  const error = ref<string | null>(null);

  // 📌 Merr punët nga backend
  const fetchJobs = async () => {
    loading.value = true;
    try {
      const response = await axios.get("https://vue-job-api-vb9n.onrender.com/jobs");
      jobs.value = response.data; // ✅ Ruaj të gjitha fushat pa i ndryshuar
    } catch (err) {
      error.value = 'Gabim gjatë marrjes së punëve';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // 📌 Ruaj një punë në të preferuarat, vetëm nëse user-i është i kyçur
  const saveJob = (job: any) => {
    if (!user.value) {
      console.warn("❌ Nuk mund të ruani punë pa u kyçur!");
      return;
    }

    if (!savedJobs.value.find((j) => j.id === job.id)) {
      savedJobs.value.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs.value));
    }
  };

  // 📌 Fshi një punë nga të preferuarat
  const removeJob = (id: number) => {
    savedJobs.value = savedJobs.value.filter((job) => job.id !== id);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs.value));
  };

  // 📌 Pastrimi i punëve të ruajtura kur user-i del
  const clearSavedJobs = () => {
    savedJobs.value = [];
    localStorage.removeItem("savedJobs");
  };

  // 📌 Filtrim i punëve sipas titullit ose vendndodhjes
  const filteredJobs = computed(() => {
    return jobs.value.filter(job =>
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // ✅ Përdor `watchEffect` për të menaxhuar `savedJobs`
  watchEffect(() => {
    if (user.value) {
      // ✅ Merr punët e ruajtura nga localStorage kur user-i kyçet
      savedJobs.value = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    } else {
      // ❌ Pastron punët e ruajtura kur user-i del
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
    clearSavedJobs // ✅ Funksioni për fshirjen e punëve të ruajtura
  };
});
