/**
 * timerStore — máquina de estados del temporizador.
 *
 * Novedades respecto al pack anterior:
 *   - tipoSeleccionado: el usuario puede elegir qué tipo de periodo
 *     arrancar (TRABAJO, DESCANSO_CORTO, DESCANSO_LARGO) antes de pulsar Empezar.
 *     Al completarse un periodo de trabajo sigue siendo él quien decide qué sigue.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sesionesService, configService, materiasService } from '@/services/timerService'

export const TIPO = {
  TRABAJO:        'TRABAJO',
  DESCANSO_CORTO: 'DESCANSO_CORTO',
  DESCANSO_LARGO: 'DESCANSO_LARGO'
}

export const ESTADO = {
  IDLE:      'idle',
  CORRIENDO: 'running',
  PAUSADO:   'paused',
  COMPLETADO:'completed'
}

export const useTimerStore = defineStore('timer', () => {

  // ── Config de tiempos ──────────────────────────────────────────────────
  const config = ref({
    tiempoTrabajo:        25,
    tiempoDescansoCorto:  5,
    tiempoDescansoLargo:  15
  })

  // ── Materias ───────────────────────────────────────────────────────────
  const materias            = ref([])
  const materiaSeleccionada = ref(null)

  // ── Tipo de periodo que el usuario quiere arrancar ─────────────────────
  // El usuario lo elige en la pantalla de configuración (idle)
  const tipoSeleccionado = ref(TIPO.TRABAJO)

  // ── Estado del timer ───────────────────────────────────────────────────
  const estado              = ref(ESTADO.IDLE)
  const tipoPeriodo         = ref(TIPO.TRABAJO)   // tipo del periodo EN CURSO
  const segundosRestantes   = ref(config.value.tiempoTrabajo * 60)
  const sesionId            = ref(null)
  const periodosCompletados = ref(0)

  let _intervalo = null

  // ── Computed ───────────────────────────────────────────────────────────
  const minutos = computed(() =>
    String(Math.floor(segundosRestantes.value / 60)).padStart(2, '0')
  )
  const segundos = computed(() =>
    String(segundosRestantes.value % 60).padStart(2, '0')
  )
  const progresoPct = computed(() => {
    const total = _duracionDe(tipoPeriodo.value) * 60
    if (total === 0) return 0
    return Math.round(((total - segundosRestantes.value) / total) * 100)
  })

  // ── Helpers privados ───────────────────────────────────────────────────
  function _duracionDe(tipo) {
    if (tipo === TIPO.TRABAJO)         return config.value.tiempoTrabajo
    if (tipo === TIPO.DESCANSO_CORTO)  return config.value.tiempoDescansoCorto
    return config.value.tiempoDescansoLargo
  }

  function _arrancarIntervalo() {
    _pararIntervalo()
    _intervalo = setInterval(() => {
      if (segundosRestantes.value <= 0) {
        _periodoCompletado()
      } else {
        segundosRestantes.value--
      }
    }, 1000)
  }

  function _pararIntervalo() {
    if (_intervalo) { clearInterval(_intervalo); _intervalo = null }
  }

  function _resetear() {
    sesionId.value          = null
    tipoPeriodo.value       = tipoSeleccionado.value
    segundosRestantes.value = _duracionDe(tipoSeleccionado.value) * 60
    estado.value            = ESTADO.IDLE
  }

  async function _periodoCompletado() {
    _pararIntervalo()
    if (sesionId.value) {
      sesionesService.registrarPeriodo(sesionId.value, {
        tipo:       tipoPeriodo.value,
        duracion:   _duracionDe(tipoPeriodo.value),
        completado: true
      }).catch(() => {})
    }
    // Solo muestra pantalla de completado en periodos de TRABAJO
    if (tipoPeriodo.value === TIPO.TRABAJO) {
      periodosCompletados.value++
      estado.value = ESTADO.COMPLETADO
    } else {
      _resetear()
    }
  }

  // ── Acciones públicas ──────────────────────────────────────────────────

  async function cargarConfig() {
    try {
      const data = await configService.get()
      config.value.tiempoTrabajo       = data.tiempoTrabajo       ?? 25
      config.value.tiempoDescansoCorto = data.tiempoDescanso      ?? 5
      config.value.tiempoDescansoLargo = data.tiempoDescansoLargo ?? 15
      actualizarSegundos()
    } catch { /* usa defaults */ }
  }

  async function cargarMaterias() {
    try { materias.value = await materiasService.getAll() }
    catch { materias.value = [] }
  }

  async function crearMateria(nombre) {
    const nueva = await materiasService.create(nombre)
    materias.value.push(nueva)
    return nueva
  }

  // Llamado cuando el usuario cambia el tipo seleccionado o los tiempos (solo en idle)
  function actualizarSegundos() {
    if (estado.value === ESTADO.IDLE) {
      tipoPeriodo.value       = tipoSeleccionado.value
      segundosRestantes.value = _duracionDe(tipoSeleccionado.value) * 60
    }
  }

  async function empezar() {
    try {
      const sesion   = await sesionesService.iniciar(materiaSeleccionada.value?.id ?? null)
      sesionId.value = sesion.id
    } catch { /* continúa sin sesión en backend */ }

    tipoPeriodo.value       = tipoSeleccionado.value
    segundosRestantes.value = _duracionDe(tipoSeleccionado.value) * 60
    estado.value            = ESTADO.CORRIENDO
    _arrancarIntervalo()
  }

  function parar() {
    estado.value = ESTADO.PAUSADO
    _pararIntervalo()
  }

  function reanudar() {
    estado.value = ESTADO.CORRIENDO
    _arrancarIntervalo()
  }

  async function abandonar() {
    _pararIntervalo()
    if (sesionId.value) {
      sesionesService.finalizar(sesionId.value, false).catch(() => {})
    }
    _resetear()
  }

  // async function iniciarDescanso() {
  //   const esLargo         = periodosCompletados.value % 4 === 0
  //   tipoPeriodo.value     = esLargo ? TIPO.DESCANSO_LARGO : TIPO.DESCANSO_CORTO
  //   segundosRestantes.value = _duracionDe(tipoPeriodo.value) * 60
  //   estado.value          = ESTADO.CORRIENDO
  //   _arrancarIntervalo()
  // }
// async function iniciarDescanso() {
//     // Finalizar la sesión como completada antes de iniciar el descanso
//     if (sesionId.value) {
//       sesionesService.finalizar(sesionId.value, true).catch(() => {})
//     }
//     const esLargo           = periodosCompletados.value % 4 === 0
//     tipoPeriodo.value       = esLargo ? TIPO.DESCANSO_LARGO : TIPO.DESCANSO_CORTO
//     segundosRestantes.value = _duracionDe(tipoPeriodo.value) * 60
//     estado.value            = ESTADO.CORRIENDO
//     _arrancarIntervalo()
//   }
async function iniciarDescanso() {
    if (sesionId.value) {
      try {
        await sesionesService.finalizar(sesionId.value, true)
        console.log('Sesión finalizada OK')
      } catch (e) {
        console.error('Error al finalizar sesión:', e)
      }
    }
    const esLargo           = periodosCompletados.value % 4 === 0
    tipoPeriodo.value       = esLargo ? TIPO.DESCANSO_LARGO : TIPO.DESCANSO_CORTO
    segundosRestantes.value = _duracionDe(tipoPeriodo.value) * 60
    estado.value            = ESTADO.CORRIENDO
    _arrancarIntervalo()
  }

  return {
    config, materias, materiaSeleccionada,
    tipoSeleccionado,
    estado, tipoPeriodo, segundosRestantes, periodosCompletados,
    minutos, segundos, progresoPct,
    ESTADO, TIPO,
    cargarConfig, cargarMaterias, crearMateria,
    empezar, parar, reanudar, abandonar, iniciarDescanso,
    actualizarSegundos
  }
})
