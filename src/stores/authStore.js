/**
 * authStore — gestiona el estado de autenticación global.
 *
 * Novedad respecto al pack anterior:
 *   - initialized: boolean que se activa cuando fetchUser() ha terminado
 *     (tanto si hay sesión como si no). App.vue lo usa para mostrar
 *     el AppLoader mientras se verifica la sesión al arrancar.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user        = ref(null)
  const loading     = ref(false)
  const error       = ref(null)
  const initialized = ref(false)   // ← NUEVO: sesión ya verificada

  const isAuthenticated = computed(() => !!user.value)
  const isPremium       = computed(() => user.value?.esPremium ?? false)

  async function fetchUser() {
    try {
      loading.value = true
      user.value    = await authService.getUser()
    } catch {
      user.value = null
    } finally {
      loading.value     = false
      initialized.value = true   // siempre se activa, haya sesión o no
    }
  }

  async function login(credentials) {
    try {
      loading.value = true
      error.value   = null
      const data    = await authService.login(credentials)
      user.value    = data.user
      return true
    } catch (e) {
      error.value = e.response?.data?.message || 'Credenciales incorrectas'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    try {
      loading.value = true
      error.value   = null
      const data    = await authService.register(userData)
      user.value    = data.user
      return true
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al registrarse'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      user.value = null
    }
  }

  return {
    user, loading, error, initialized,
    isAuthenticated, isPremium,
    fetchUser, login, register, logout
  }
})
