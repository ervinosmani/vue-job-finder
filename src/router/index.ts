import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Jobs from '@/pages/Jobs.vue';
import SavedJobs from '@/pages/SavedJobs.vue';
import JobDetails from '@/pages/JobDetails.vue';
import Login from '@/pages/Login.vue';

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
      path: '/saved-jobs',
      name: 'saved-jobs',
      component: SavedJobs,
    },
    {
      path: '/jobs/:id',
      name: 'job-details',
      component: JobDetails
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ],
});

export default router;
