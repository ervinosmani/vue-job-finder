import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import axios from 'axios';

export const useJobStore = defineStore('jobStore', () => {
  const jobs = ref<any[]>([]); // Punët nga backend
  const savedJobs = ref<any[]>(JSON.parse(localStorage.getItem('savedJobs') || '[]')); // Punët e ruajtura lokalisht
  const searchQuery = ref(''); // ✅ Kërkimi i punëve

  const loading = ref(false);
  const error = ref<string | null>(null);

  // 📌 Merr punët nga JSON Server në vend të JSONPlaceholder
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

  // 📌 Ruaj një punë në localStorage
  const saveJob = (job: any) => {
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

  // 📌 Filtrim i punëve sipas titullit ose vendndodhjes
  const filteredJobs = computed(() => {
    return jobs.value.filter(job =>
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // 📌 Ruaj punët e preferuara në localStorage
  watch(savedJobs, (newJobs) => {
    localStorage.setItem('savedJobs', JSON.stringify(newJobs));
  }, { deep: true });

  return { 
    jobs, 
    savedJobs, 
    searchQuery, 
    loading, 
    error, 
    fetchJobs, 
    saveJob, 
    removeJob, 
    filteredJobs 
  };
});
