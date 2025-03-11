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
      jobs.value = response.data.map((job: any, index: number) => ({
        id: job.id,
        title: job.title,
        body: job.body,
        company: `Company ${index % 5 + 1}`,  // Simulon kompani të ndryshme
        location: index % 2 === 0 ? 'Remote' : 'On-site',  // Alternon mes Remote dhe On-site
        salary: Math.floor(Math.random() * 100000) + 40000,  // Gjeneron rrogë midis $40,000 - $140,000
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
