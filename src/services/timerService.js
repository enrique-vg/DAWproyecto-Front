/**
 * timerService — acceso a la API para todo lo relacionado con el timer.
 *
 * Endpoints que consume:
 *   GET  /api/configuracion               → tiempos de trabajo y descanso
 *   PUT  /api/configuracion               → guardar cambios de config
 *   GET  /api/materias                    → lista de materias del usuario
 *   POST /api/materias                    → crear nueva materia
 *   DEL  /api/materias/:id               → eliminar materia
 *   POST /api/sesiones                    → iniciar sesión pomodoro
 *   PATCH /api/sesiones/:id/finalizar     → marcar sesión como terminada
 *   POST /api/sesiones/:id/periodos       → registrar un periodo (trabajo/descanso)
 */
import api from './api'

// ── Configuración ──────────────────────────────────────────────────────────
export const configService = {
  async get() {
    const { data } = await api.get('/api/configuracion')
    return data
  },
  async update(config) {
    const { data } = await api.put('/api/configuracion', config)
    return data
  }
}

// ── Materias ───────────────────────────────────────────────────────────────
export const materiasService = {
  async getAll() {
    const { data } = await api.get('/api/materias')
    return data
  },
  async create(nombre) {
    const { data } = await api.post('/api/materias', { nombre })
    return data
  },
  async delete(id) {
    await api.delete(`/api/materias/${id}`)
  }
}

// ── Sesiones y periodos ────────────────────────────────────────────────────
export const sesionesService = {
  async iniciar(materiaId = null) {
    const { data } = await api.post('/api/sesiones', { materia_id: materiaId })
    return data
  },
  async finalizar(sesionId, completado = true) {
    const { data } = await api.patch(`/api/sesiones/${sesionId}/finalizar`, { completado })
    return data
  },
  async registrarPeriodo(sesionId, periodo) {
    // periodo: { tipo: 'TRABAJO'|'DESCANSO_CORTO'|'DESCANSO_LARGO', duracion, completado }
    const { data } = await api.post(`/api/sesiones/${sesionId}/periodos`, periodo)
    return data
  }
}
