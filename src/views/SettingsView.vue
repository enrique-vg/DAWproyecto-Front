<template>
  <div class="settings-page">
    <AppNav />

    <main class="settings-main">
      <div class="settings-wrapper">

        <div class="settings-header">
          <button class="settings-back" @click="router.back()">
            <i class="pi pi-arrow-left"></i> Volver
          </button>
          <h1 class="settings-title">Ajustes</h1>
        </div>

        <section class="settings-section">
          <h2 class="settings-section__titulo">
            <i class="pi pi-clock"></i> Tiempos por defecto
          </h2>
          <p class="settings-section__desc">Estos valores se cargarán cada vez que abras el timer.</p>

          <div class="settings-tiempos">
            <div class="settings-tiempo" v-for="t in tiposConfig" :key="t.key">
              <label class="settings-tiempo__label">{{ t.label }}</label>
              <select v-model.number="configLocal[t.key]" class="settings-select" @change="marcarCambio">
                <option v-for="min in t.opciones" :key="min" :value="min">{{ min }} min</option>
              </select>
            </div>
          </div>

          <div class="settings-actions">
            <button class="btn btn--primary btn--md" @click="guardarConfig" :disabled="!hayCambios || guardando">
              <i v-if="guardando" class="pi pi-spin pi-spinner" style="margin-right:0.4rem"></i>
              {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </section>

        <section class="settings-section">
          <h2 class="settings-section__titulo">
            <i class="pi pi-book"></i> Mis materias
          </h2>
          <p class="settings-section__desc">Las materias que aparecen en el selector del timer.</p>

          <ul class="settings-materias" v-if="timerStore.materias.length">
            <li v-for="m in timerStore.materias" :key="m.id" class="settings-materia-item">
              <span class="settings-materia-item__nombre">{{ m.nombre }}</span>
              <button class="settings-materia-item__del" @click="confirmarEliminar(m)" :aria-label="`Eliminar ${m.nombre}`">
                <i class="pi pi-trash"></i>
              </button>
            </li>
          </ul>
          <p v-else class="settings-materias-vacio">No tienes materias creadas todavía.</p>

          <div class="settings-add-materia">
            <InputText v-model="nuevaMateria" placeholder="Nueva materia..." @keydown.enter="añadirMateria" class="settings-add-materia__input" />
            <button class="btn btn--primary btn--md" @click="añadirMateria" :disabled="!nuevaMateria.trim()">
              <i class="pi pi-plus"></i> Añadir
            </button>
          </div>
        </section>

      </div>
    </main>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="materiaAEliminar" class="modal-backdrop" @click.self="materiaAEliminar = null">
          <div class="modal-card" role="dialog" aria-modal="true">
            <h3 class="modal-card__title">Eliminar materia</h3>
            <p class="modal-card__body">
              ¿Seguro que quieres eliminar <strong>{{ materiaAEliminar.nombre }}</strong>?
            </p>
            <div class="modal-card__actions">
              <button class="btn btn--ghost btn--md" @click="materiaAEliminar = null">Cancelar</button>
              <button class="btn btn--danger btn--md" @click="ejecutarEliminar">Eliminar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNav from '@/components/ui/AppNav.vue'
import { useTimerStore } from '@/stores/timerStore'
import { configService, materiasService } from '@/services/timerService'
import { useToast } from '@/composables/useToast'

const router     = useRouter()
const timerStore = useTimerStore()
const toast      = useToast()

const configLocal = reactive({
  tiempoTrabajo:        timerStore.config.tiempoTrabajo,
  tiempoDescansoCorto:  timerStore.config.tiempoDescansoCorto,
  tiempoDescansoLargo:  timerStore.config.tiempoDescansoLargo
})

const tiposConfig = [
  { key: 'tiempoTrabajo',       label: 'Tiempo de trabajo', opciones: [1, 15, 20, 25, 30, 45, 50, 60] },
  { key: 'tiempoDescansoCorto', label: 'Descanso corto',    opciones: [1, 3, 5, 10] },
  { key: 'tiempoDescansoLargo', label: 'Descanso largo',    opciones: [1, 10, 15, 20, 30] }
]

const hayCambios = ref(false)
const guardando  = ref(false)
function marcarCambio() { hayCambios.value = true }

async function guardarConfig() {
  guardando.value = true
  try {
    await configService.update({
      tiempoTrabajo:       configLocal.tiempoTrabajo,
      tiempoDescanso:      configLocal.tiempoDescansoCorto,
      tiempoDescansoLargo: configLocal.tiempoDescansoLargo
    })
    timerStore.config.tiempoTrabajo       = configLocal.tiempoTrabajo
    timerStore.config.tiempoDescansoCorto = configLocal.tiempoDescansoCorto
    timerStore.config.tiempoDescansoLargo = configLocal.tiempoDescansoLargo
    timerStore.actualizarSegundos()
    hayCambios.value = false
    toast.success('Configuración guardada correctamente')
  } catch {
    toast.error('No se pudo guardar la configuración')
  } finally {
    guardando.value = false
  }
}

const nuevaMateria     = ref('')
const materiaAEliminar = ref(null)

onMounted(() => timerStore.cargarMaterias())

async function añadirMateria() {
  if (!nuevaMateria.value.trim()) return
  try {
    await timerStore.crearMateria(nuevaMateria.value.trim())
    toast.success(`Materia "${nuevaMateria.value.trim()}" añadida`)
    nuevaMateria.value = ''
  } catch {
    toast.error('No se pudo añadir la materia')
  }
}

function confirmarEliminar(materia) { materiaAEliminar.value = materia }

async function ejecutarEliminar() {
  if (!materiaAEliminar.value) return
  const nombre = materiaAEliminar.value.nombre
  try {
    await materiasService.delete(materiaAEliminar.value.id)
    timerStore.materias = timerStore.materias.filter(m => m.id !== materiaAEliminar.value.id)
    if (timerStore.materiaSeleccionada?.id === materiaAEliminar.value.id) timerStore.materiaSeleccionada = null
    toast.success(`"${nombre}" eliminada`)
  } catch {
    toast.error('No se pudo eliminar la materia')
  } finally {
    materiaAEliminar.value = null
  }
}
</script>

<style scoped>
.settings-page { min-height: 100vh; min-height: 100dvh; display: flex; flex-direction: column; background: var(--color-bg); }
.settings-main { flex: 1; display: flex; justify-content: center; padding: 1.5rem var(--page-padding) 3rem; }
.settings-wrapper { width: 100%; max-width: 460px; display: flex; flex-direction: column; gap: 1.5rem; }

.settings-header { display: flex; align-items: center; gap: 1rem; }
.settings-back {
  background: none; border: none; color: var(--color-text-muted);
  font-family: var(--font-display); font-size: 0.85rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0; transition: color 0.2s; min-height: 44px;
}
.settings-back:hover { color: var(--color-text); }
.settings-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--color-text); }

.settings-section {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-lg); padding: 1.5rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.settings-section__titulo { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--color-text); display: flex; align-items: center; gap: 0.5rem; }
.settings-section__desc { font-size: 0.82rem; color: var(--color-text-muted); margin-top: -0.5rem; }

.settings-tiempos { display: flex; flex-direction: column; gap: 0.75rem; }
.settings-tiempo { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 48px; }
.settings-tiempo__label { font-size: 0.9rem; color: var(--color-text-muted); font-weight: 500; }
.settings-select {
  background: var(--color-surface-2); border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm); color: var(--color-text);
  font-family: var(--font-display); font-size: 0.9rem;
  padding: 0.5rem 0.75rem; cursor: pointer; outline: none;
  transition: border-color 0.2s; min-width: 110px; text-align: center;
  min-height: 44px;
}
.settings-select:focus { border-color: var(--color-primary); }
.settings-actions { display: flex; align-items: center; gap: 1rem; }

.settings-materias { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
.settings-materia-item {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--color-surface-2); border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-sm); padding: 0.75rem 0.85rem;
  transition: border-color 0.2s; min-height: 48px;
}
.settings-materia-item:hover { border-color: var(--color-border); }
.settings-materia-item__nombre { font-size: 0.9rem; color: var(--color-text); }
.settings-materia-item__del {
  background: none; border: none; color: var(--color-text-dim);
  cursor: pointer; padding: 0.4rem; border-radius: var(--radius-sm);
  transition: color 0.2s, background 0.2s; display: flex; align-items: center;
  min-width: 36px; min-height: 36px; justify-content: center;
}
.settings-materia-item__del:hover { color: var(--color-danger); background: rgba(255,94,94,0.1); }
.settings-materias-vacio { font-size: 0.85rem; color: var(--color-text-dim); text-align: center; padding: 0.5rem; }

.settings-add-materia { display: flex; gap: 0.5rem; align-items: center; }
.settings-add-materia__input { flex: 1; }

.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px); display: flex; align-items: center;
  justify-content: center; z-index: 300; padding: var(--page-padding);
}
.modal-card {
  background: var(--color-surface); border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg); padding: 2rem; width: 100%; max-width: 320px;
  display: flex; flex-direction: column; gap: 1.25rem; text-align: center;
}
.modal-card__title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--color-text); }
.modal-card__body { font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.6; }
.modal-card__body strong { color: var(--color-text); }
.modal-card__actions { display: flex; gap: 0.75rem; justify-content: center; }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-card { transform: scale(0.95) translateY(8px); }
</style>
