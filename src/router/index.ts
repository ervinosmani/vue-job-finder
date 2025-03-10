import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Jobs from '@/pages/Jobs.vue';
import SavedJobs from '@/pages/SavedJobs.vue';

const router = createRouter({
  history: createWebHistory(), // Nuk ka nevojë për import.meta.env.BASE_URL
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
  ],
});

export default router;
