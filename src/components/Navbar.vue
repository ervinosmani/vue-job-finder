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

// ✅ Funksioni për logout dhe ridrejtim në Home
const handleLogout = async () => {
  await signOut(auth);
  isOpen.value = false; // ✅ Mbyll hamburger menu pas logout
  router.push('/'); // ✅ Ridrejto në Home
};

// ✅ Mbyll hamburger menu kur klikon një opsion
const closeMenu = () => {
  isOpen.value = false;
};

// ✅ Kontrollon nëse jemi në një faqe të caktuar për ta stilizuar si aktive
const isActive = (path: string) => {
  return route.path === path ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:text-blue-400';
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

      <!-- ✅ Hamburger menu button -->
      <button @click="isOpen = !isOpen" class="md:hidden text-white text-3xl focus:outline-none">
        ☰
      </button>

      <!-- ✅ Hamburger menu (rregulluar për ekrane të vogla) -->
      <ul
        :class="[ 'md:flex md:space-x-6 transition-all duration-300',
          isOpen ? 'block' : 'hidden']"
        class="absolute md:static top-16 left-0 bg-gray-900 w-full md:w-auto md:flex md:items-center text-lg p-4 md:p-0 rounded-lg text-center"
      >
        <li><router-link to="/" class="block p-2 px-4 rounded-md" :class="isActive('/')" @click="closeMenu">Home</router-link></li>
        <li><router-link to="/jobs" class="block p-2 px-4 rounded-md" :class="isActive('/jobs')" @click="closeMenu">Jobs</router-link></li>
        <li><router-link to="/saved-jobs" class="block p-2 px-4 rounded-md" :class="isActive('/saved-jobs')" @click="closeMenu">Saved Jobs</router-link></li>

        <!-- ✅ Login button me madhësi të njëjtë me Logout -->
        <li v-if="!user">
          <router-link to="/login" 
            class="block p-2 px-4 bg-blue-500 hover:bg-blue-600 transition rounded-md text-white mx-auto w-28 text-center"
            @click="closeMenu">
            Login
          </router-link>
        </li>

        <!-- ✅ Logout button me madhësi të njëjtë me Login -->
        <li v-else class="mt-2">
          <button 
            @click="handleLogout"
            class="block p-2 px-4 bg-red-500 hover:bg-red-600 transition text-white rounded-md mx-auto w-28 text-center"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
/* ✅ Sigurohemi që navbar-i të mos mbulojë përmbajtjen */
body {
  padding-top: 4rem;
}

/* ✅ Rregullojmë distancën dhe qendrimin e opsioneve në mobile */
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
