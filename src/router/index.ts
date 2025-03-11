import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Jobs from '@/pages/Jobs.vue';
import SavedJobs from '@/pages/SavedJobs.vue';
import JobDetails from '@/pages/JobDetails.vue';

const router = createRouter({
  history: createWebHistory(), 
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: Jobs,
    },
    {
      path: '/saved',
      name: 'saved',
      component: SavedJobs,
    },
    {
      path: '/jobs/:id', 
      name: 'job-details', 
      component: JobDetails
    },
  ],
});

export default router;
