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
    path: '/timer',
    name: 'timer',
    component: () => import('@/views/TimerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/views/StatsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    // Captura cualquier ruta no definida → 404
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Scroll al inicio en cada navegación
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Esperar a que la sesión esté inicializada antes de navegar
  // (evita el flash de redirección al login en el primer load)
  if (!auth.initialized && to.meta.requiresAuth) {
    await auth.fetchUser()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'welcome' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'timer' }
  }
})

export default router
