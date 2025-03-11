import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import axios from 'axios';

export const useJobStore = defineStore('jobStore', () => {
  const jobs = ref<any[]>([]);
  const savedJobs = ref<any[]>(JSON.parse(localStorage.getItem('savedJobs') || '[]'));
  const searchQuery = ref(''); // ✅ Krijojmë një state për tekstin e kërkimit

  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchJobs = async () => {
    loading.value = true;
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      
      // Shtojmë një link aplikimi për çdo punë
      jobs.value = response.data.map(job => ({
        ...job,
        company: `Company ${job.id}`, // Emri i kompanisë
        location: job.id % 2 === 0 ? 'Remote' : 'On-site', // Vendndodhja
        salary: Math.floor(Math.random() * 80000) + 40000, // Paga (random)
        applyLink: `https://www.linkedin.com/jobs/view/${job.id}` // 📌 Link i imagjinuar për aplikim
      }));
    } catch (err) {
      error.value = 'Failed to load jobs';
    } finally {
      loading.value = false;
    }
  };
  
  

  const saveJob = (job: any) => {
    if (!savedJobs.value.find((j) => j.id === job.id)) {
      savedJobs.value.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs.value));
    }
  };

  const removeJob = (id: number) => {
    savedJobs.value = savedJobs.value.filter((job) => job.id !== id);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs.value));
  };

  // ✅ Filtrim i punëve sipas titullit ose vendndodhjes
  const filteredJobs = computed(() => {
    return jobs.value.filter(job =>
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  watch(savedJobs, (newJobs) => {
    localStorage.setItem('savedJobs', JSON.stringify(newJobs));
  }, { deep: true });

  return { jobs, savedJobs, searchQuery, loading, error, fetchJobs, saveJob, removeJob, filteredJobs };
});
