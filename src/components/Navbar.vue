<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { auth, user } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isOpen = ref(false);
const hasScrolled = ref(false);

const handleScroll = () => {
  hasScrolled.value = window.scrollY > 50;
};

// Logout me konfirmim
const handleLogout = async () => {
  const confirmLogout = window.confirm("Are you sure you want to log out?"); // Pyet perdoruesin para logout
  if (confirmLogout) {
    await signOut(auth);
    isOpen.value = false; // Mbyll hamburger menu pas logout
    router.push('/'); // Ridrejto ne Home
  }
};

// Mbyll hamburger menu kur klikon nje opsion
const closeMenu = () => {
  isOpen.value = false;
};

// Kontrollon nese jemi ne nje faqe te caktuar per ta stilizuar si aktive
const isActive = (path: string) => {
  return route.path === path
    ? 'bg-blue-700 text-white font-bold rounded-md shadow-md px-4 py-2 transition-all duration-200'
    : 'text-gray-300 hover:text-blue-400';
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <nav
    :class="['fixed top-0 w-full z-50 transition-all duration-300',
              hasScrolled ? 'bg-gray-900 shadow-lg bg-opacity-90' : 'bg-gray-800']">
    <div class="container mx-auto flex justify-between items-center px-6 py-4">
      <router-link to="/" class="text-2xl font-bold text-white">Vue Job Finder</router-link>

      <!-- Hamburger menu button (per mobile) -->
      <button @click="isOpen = !isOpen" class="md:hidden text-white text-3xl focus:outline-none">
        ☰
      </button>

      <!-- Menu per desktop dhe mobile -->
      <ul
        :class="['md:flex md:space-x-4 transition-all duration-300',
                  isOpen ? 'block space-y-4' : 'hidden']" 
        class="absolute md:static top-16 left-0 bg-gray-900 w-full md:w-auto md:flex md:items-center text-lg p-4 md:p-0 rounded-lg text-center"
      >
        <li><router-link to="/" :class="isActive('/')" @click="closeMenu">Home</router-link></li>
        <li><router-link to="/jobs" :class="isActive('/jobs')" @click="closeMenu">Jobs</router-link></li>
        <li><router-link to="/saved-jobs" :class="isActive('/saved-jobs')" @click="closeMenu">Saved Jobs</router-link></li>

        <!-- Login dhe Logout buttons me permasa te njejta -->
        <li v-if="!user">
          <router-link to="/login" 
            class="block p-2 px-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition rounded-lg text-white mx-auto w-28 text-center shadow-lg"
            @click="closeMenu">
            Login
          </router-link>
        </li>

        <li v-else>
          <button 
            @click="handleLogout"
            class="block p-2 px-4 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition text-white rounded-lg mx-auto w-28 text-center shadow-lg"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>


<style scoped>
/* Sigurohemi qe navbar-i te mos mbuloje permbajtjen */
body {
  padding-top: 4rem;
}

/* Rregullojme distancen dhe qendrimin e opsioneve ne mobile */
@media (max-width: 768px) {
  ul {
    text-align: center;
  }
  li {
    width: auto;
    margin: 5px auto;
  }
}
</style>
