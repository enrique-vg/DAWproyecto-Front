/**
 * authStore — gestiona el estado de autenticación global.
 *
 * Expone:
 *   user            → objeto usuario o null
 *   isAuthenticated → computed boolean
 *   isPremium       → computed boolean
 *   loading         → boolean durante peticiones
 *   error           → string con el último error
 *
 *   fetchUser()  → intenta cargar el usuario desde /api/user
 *   login()      → credenciales → actualiza user
 *   register()   → datos registro → actualiza user
 *   logout()     → limpia user
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref(null)
  const loading = ref(false)
  const error   = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isPremium       = computed(() => user.value?.esPremium ?? false)

  async function fetchUser() {
    try {
      loading.value = true
      user.value = await authService.getUser()
    } catch {
      user.value = null   // sesión no activa o backend no disponible
    } finally {
      loading.value = false
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
    user, loading, error,
    isAuthenticated, isPremium,
    fetchUser, login, register, logout
  }
})
