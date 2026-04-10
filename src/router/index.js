import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('@/views/WelcomeView.vue'),
    meta: { public: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { public: true, guestOnly: true }
  },
  {
    // Placeholder — en el pack Día 2 se sustituye por el timer real
    path: '/timer',
    name: 'timer',
    component: () => import('@/views/TimerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard global: protege rutas privadas y redirige a /timer si ya estás logueado
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Si la ruta requiere auth y no sabemos si el usuario está logueado, lo intentamos cargar
  if (!auth.user && to.meta.requiresAuth) {
    await auth.fetchUser()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'timer' }
  }
})

export default router
