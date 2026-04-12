/**
 * statsStore — gestiona el estado de la vista de estadísticas.
 *
 * Expone:
 *   progreso        → { totalSesiones, totalTiempo, grafico }
 *   hitos           → array de hitos del usuario
 *   periodoActivo   → 'dia' | 'semana' | 'mes' | 'año'
 *   fechaActiva     → string 'YYYY-MM-DD'
 *   esFechaFutura   → computed boolean (bloquea flecha →)
 *   loading         → boolean durante peticiones
 *
 *   cargarProgreso(periodo?, fecha?)  → carga datos del periodo
 *   cargarHitos()                     → carga hitos del usuario
 *   navegarFecha(direccion)           → +1 avanza, -1 retrocede
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { statsService } from '@/services/statsService'

export const useStatsStore = defineStore('stats', () => {

  const progreso      = ref(null)
  const hitos         = ref([])
  const loading       = ref(false)
  const periodoActivo = ref('semana')
  const fechaActiva   = ref(new Date().toISOString().split('T')[0])

  async function cargarProgreso(
    periodo = periodoActivo.value,
    fecha   = fechaActiva.value
  ) {
    loading.value       = true
    periodoActivo.value = periodo
    fechaActiva.value   = fecha
    try {
      progreso.value = await statsService.getProgreso(periodo, fecha)
    } catch {
      progreso.value = null
    } finally {
      loading.value = false
    }
  }

  async function cargarHitos() {
    try {
      hitos.value = await statsService.getHitos()
    } catch {
      hitos.value = []
    }
  }

  function navegarFecha(direccion) {
    // Crea fecha con mediodía para evitar problemas de zona horaria
    const d = new Date(fechaActiva.value + 'T12:00:00')

    if (periodoActivo.value === 'dia')    d.setDate(d.getDate() + direccion)
    if (periodoActivo.value === 'semana') d.setDate(d.getDate() + direccion * 7)
    if (periodoActivo.value === 'mes')    d.setMonth(d.getMonth() + direccion)
    if (periodoActivo.value === 'año')    d.setFullYear(d.getFullYear() + direccion)

    fechaActiva.value = d.toISOString().split('T')[0]
    cargarProgreso()
  }

  // Impide navegar al futuro
  const esFechaFutura = computed(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return fechaActiva.value >= hoy
  })

  return {
    progreso, hitos, loading,
    periodoActivo, fechaActiva, esFechaFutura,
    cargarProgreso, cargarHitos, navegarFecha
  }
})
