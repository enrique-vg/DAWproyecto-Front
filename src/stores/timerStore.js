/**
 * timerStore — máquina de estados del temporizador.
 *
 * Estados posibles (ESTADO):
 *   idle       → pantalla de configuración, timer parado
 *   running    → cuenta atrás activa
 *   paused     → pausado por el usuario (muestra modal abandonar)
 *   completed  → periodo de trabajo terminado (muestra pantalla éxito)
 *
 * Tipos de periodo (TIPO):
 *   TRABAJO, DESCANSO_CORTO, DESCANSO_LARGO
 *
 * Flujo normal:
 *   idle → [empezar] → running → [00:00] → completed
 *                   → [parar]  → paused  → [volver]   → running
 *                                        → [abandonar] → idle
 *   completed → [uno más]   → running (nuevo trabajo)
 *            → [descanso]   → running (descanso corto/largo)
 *            → [no completé] → idle
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
  const materias             = ref([])
  const materiaSeleccionada  = ref(null)

  // ── Estado del timer ───────────────────────────────────────────────────
  const estado             = ref(ESTADO.IDLE)
  const tipoPeriodo        = ref(TIPO.TRABAJO)
  const segundosRestantes  = ref(config.value.tiempoTrabajo * 60)
  const sesionId           = ref(null)
  const periodosCompletados = ref(0)   // cada 4 trabajos → descanso largo

  let _intervalo = null

  // ── Computed ───────────────────────────────────────────────────────────
  const minutos = computed(() =>
    String(Math.floor(segundosRestantes.value / 60)).padStart(2, '0')
  )
  const segundos = computed(() =>
    String(segundosRestantes.value % 60).padStart(2, '0')
  )
  const progresoPct = computed(() => {
    const total = _duracionActual() * 60
    if (total === 0) return 0
    return Math.round(((total - segundosRestantes.value) / total) * 100)
  })

  // ── Helpers privados ───────────────────────────────────────────────────
  function _duracionActual() {
    if (tipoPeriodo.value === TIPO.TRABAJO)         return config.value.tiempoTrabajo
    if (tipoPeriodo.value === TIPO.DESCANSO_CORTO)  return config.value.tiempoDescansoCorto
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
    tipoPeriodo.value       = TIPO.TRABAJO
    segundosRestantes.value = config.value.tiempoTrabajo * 60
    estado.value            = ESTADO.IDLE
  }

  async function _periodoCompletado() {
    _pararIntervalo()
    // Registrar en backend (no bloquea aunque falle)
    if (sesionId.value) {
      sesionesService.registrarPeriodo(sesionId.value, {
        tipo:       tipoPeriodo.value,
        duracion:   _duracionActual(),
        completado: true
      }).catch(() => {})
    }

    if (tipoPeriodo.value === TIPO.TRABAJO) {
      periodosCompletados.value++
      estado.value = ESTADO.COMPLETADO
    } else {
      // Tras descanso → vuelve a idle para nueva sesión
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
      segundosRestantes.value = config.value.tiempoTrabajo * 60
    } catch { /* usa defaults */ }
  }

  async function cargarMaterias() {
    try {
      materias.value = await materiasService.getAll()
    } catch { materias.value = [] }
  }

  async function crearMateria(nombre) {
    const nueva = await materiasService.create(nombre)
    materias.value.push(nueva)
    return nueva
  }

  async function empezar() {
    try {
      const sesion   = await sesionesService.iniciar(materiaSeleccionada.value?.id ?? null)
      sesionId.value = sesion.id
    } catch { /* continúa sin sesión en backend */ }

    tipoPeriodo.value       = TIPO.TRABAJO
    segundosRestantes.value = config.value.tiempoTrabajo * 60
    estado.value            = ESTADO.CORRIENDO
    _arrancarIntervalo()
  }

  function parar() {
    // Solo pausa — el componente abre el modal de confirmación
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

  async function iniciarDescanso() {
    // Cada 4 pomodoros → descanso largo
    const esLargo         = periodosCompletados.value % 4 === 0
    tipoPeriodo.value     = esLargo ? TIPO.DESCANSO_LARGO : TIPO.DESCANSO_CORTO
    segundosRestantes.value = (esLargo
      ? config.value.tiempoDescansoLargo
      : config.value.tiempoDescansoCorto) * 60
    estado.value = ESTADO.CORRIENDO
    _arrancarIntervalo()
  }

  function actualizarSegundos() {
    // Llamado cuando el usuario cambia los tiempos en el config (solo en idle)
    if (estado.value === ESTADO.IDLE) {
      segundosRestantes.value = config.value.tiempoTrabajo * 60
    }
  }

  return {
    // Estado
    config, materias, materiaSeleccionada,
    estado, tipoPeriodo, segundosRestantes, periodosCompletados,
    // Computed
    minutos, segundos, progresoPct,
    // Constantes exportadas para usar en componentes
    ESTADO, TIPO,
    // Acciones
    cargarConfig, cargarMaterias, crearMateria,
    empezar, parar, reanudar, abandonar, iniciarDescanso,
    actualizarSegundos
  }
})
