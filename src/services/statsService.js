/**
 * statsService — acceso a la API de estadísticas.
 *
 * Endpoints que consume:
 *   GET /api/progreso?periodo=semana&fecha=2024-01-15
 *     → { totalSesiones, totalTiempo, grafico: { labels[], datos[] } }
 *
 *   GET /api/hitos
 *     → [{ id, descripcion, fecha }]
 */
import api from './api'

export const statsService = {
  async getProgreso(periodo = 'semana', fecha = null) {
    const params = { periodo }
    if (fecha) params.fecha = fecha
    const { data } = await api.get('/api/progreso', { params })
    return data
  },

  async getHitos() {
    const { data } = await api.get('/api/hitos')
    return data
  }
}
