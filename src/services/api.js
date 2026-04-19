/**
 * api.js — instancia Axios configurada para Laravel Sanctum (SPA auth).
 *
 * Puntos clave:
 *   - withCredentials: true  → envía cookies de sesión en cada petición
 *   - withXSRFToken: true    → Axios lee el cookie XSRF-TOKEN y lo adjunta
 *                              automáticamente como cabecera X-XSRF-TOKEN
 *   - baseURL desde .env     → VITE_API_URL (por defecto http://localhost:8000)
 *   - Interceptor 401        → redirige al login si la sesión expira
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      import('@/router').then(({ default: router }) => {
        const rutasProtegidas = ['timer', 'stats', 'profile', 'settings']
        if (rutasProtegidas.includes(router.currentRoute.value.name)) {
          router.push({ name: 'welcome' })
        }
      })
    }
    return Promise.reject(error)
  }
)

export default api
