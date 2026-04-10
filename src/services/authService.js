/**
 * authService — capa de acceso a la API para autenticación.
 *
 * Sanctum SPA requiere llamar a /sanctum/csrf-cookie ANTES de
 * cualquier POST de login o register. Eso coloca el cookie XSRF-TOKEN
 * que Axios reenvía automáticamente en las siguientes peticiones.
 */
import api from './api'

export const authService = {
  async getCsrfCookie() {
    await api.get('/sanctum/csrf-cookie')
  },

  async login(credentials) {
    await this.getCsrfCookie()
    const { data } = await api.post('/api/login', credentials)
    return data   // { user: {...} }
  },

  async register(userData) {
    await this.getCsrfCookie()
    const { data } = await api.post('/api/register', userData)
    return data   // { user: {...} }
  },

  async logout() {
    await api.post('/api/logout')
  },

  async getUser() {
    const { data } = await api.get('/api/user')
    return data   // objeto usuario o lanza 401
  }
}
