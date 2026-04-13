<template>
  <div class="settings-page">
    <AppNav />

    <main class="settings-main">
      <div class="settings-wrapper">

        <!-- Cabecera -->
        <div class="settings-header">
          <button class="settings-back" @click="router.back()">
            <i class="pi pi-arrow-left"></i> Volver
          </button>
          <h1 class="settings-title">Ajustes</h1>
        </div>

        <!-- Sección: Tiempos por defecto -->
        <section class="settings-section">
          <h2 class="settings-section__titulo">
            <i class="pi pi-clock"></i> Tiempos por defecto
          </h2>
          <p class="settings-section__desc">
            Estos valores se cargarán cada vez que abras el timer.
          </p>

          <div class="settings-tiempos">
            <div class="settings-tiempo" v-for="t in tiposConfig" :key="t.key">
              <label class="settings-tiempo__label">{{ t.label }}</label>
              <select
                v-model.number="configLocal[t.key]"
                class="settings-select"
                @change="marcarCambio"
              >
                <option v-for="min in t.opciones" :key="min" :value="min">{{ min }} min</option>
              </select>
            </div>
          </div>

          <div class="settings-actions">
            <button
              class="btn btn--primary btn--md"
              @click="guardarConfig"
              :disabled="!hayCambios || guardando"
            >
              <i v-if="guardando" class="pi pi-spin pi-spinner" style="margin-right:0.4rem"></i>
              {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
            </button>
            <Transition name="fade-msg">
              <span v-if="guardadoOk" class="settings-ok">
                <i class="pi pi-check"></i> Guardado
              </span>
            </Transition>
          </div>
        </section>

        <!-- Sección: Materias -->
        <section class="settings-section">
          <h2 class="settings-section__titulo">
            <i class="pi pi-book"></i> Mis materias
          </h2>
          <p class="settings-section__desc">
            Las materias que aparecen en el selector del timer.
          </p>

          <!-- Lista de materias -->
          <ul class="settings-materias" v-if="timerStore.materias.length">
            <li
              v-for="m in timerStore.materias"
              :key="m.id"
              class="settings-materia-item"
            >
              <span class="settings-materia-item__nombre">{{ m.nombre }}</span>
              <button
                class="settings-materia-item__del"
                @click="eliminarMateria(m.id)"
                :aria-label="`Eliminar ${m.nombre}`"
              >
                <i class="pi pi-trash"></i>
              </button>
            </li>
          </ul>
          <p v-else class="settings-materias-vacio">
            No tienes materias creadas todavía.
          </p>

          <!-- Añadir materia -->
          <div class="settings-add-materia">
            <InputText
              v-model="nuevaMateria"
              placeholder="Nueva materia..."
              @keydown.enter="añadirMateria"
              class="settings-add-materia__input"
            />
            <button
              class="btn btn--primary btn--md"
              @click="añadirMateria"
              :disabled="!nuevaMateria.trim()"
            >
              <i class="pi pi-plus"></i> Añadir
            </button>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNav from '@/components/ui/AppNav.vue'
import { useTimerStore } from '@/stores/timerStore'
import { configService, materiasService } from '@/services/timerService'

const router     = useRouter()
const timerStore = useTimerStore()

// Config local — copia del store para poder editar sin afectar el timer activo
const configLocal = reactive({
  tiempoTrabajo:        timerStore.config.tiempoTrabajo,
  tiempoDescansoCorto:  timerStore.config.tiempoDescansoCorto,
  tiempoDescansoLargo:  timerStore.config.tiempoDescansoLargo
})

const tiposConfig = [
  { key: 'tiempoTrabajo',       label: 'Tiempo de trabajo',    opciones: [1, 15, 20, 25, 30, 45, 50, 60] },
  { key: 'tiempoDescansoCorto', label: 'Descanso corto',       opciones: [1, 3, 5, 10] },
  { key: 'tiempoDescansoLargo', label: 'Descanso largo',       opciones: [1, 10, 15, 20, 30] }
]

const hayCambios = ref(false)
const guardando  = ref(false)
const guardadoOk = ref(false)

function marcarCambio() { hayCambios.value = true }

async function guardarConfig() {
  guardando.value = true
  try {
    await configService.update({
      tiempoTrabajo:  configLocal.tiempoTrabajo,
      tiempoDescanso: configLocal.tiempoDescansoCorto,
      tiempoDescansoLargo: configLocal.tiempoDescansoLargo
    })
    // Sincroniza el store del timer
    timerStore.config.tiempoTrabajo       = configLocal.tiempoTrabajo
    timerStore.config.tiempoDescansoCorto = configLocal.tiempoDescansoCorto
    timerStore.config.tiempoDescansoLargo = configLocal.tiempoDescansoLargo
    timerStore.actualizarSegundos()

    hayCambios.value = false
    guardadoOk.value = true
    setTimeout(() => { guardadoOk.value = false }, 2500)
  } catch {
    // En un pack posterior añadiremos toast de error
  } finally {
    guardando.value = false
  }
}

// Materias
const nuevaMateria = ref('')

onMounted(() => {
  timerStore.cargarMaterias()
})

async function añadirMateria() {
  if (!nuevaMateria.value.trim()) return
  await timerStore.crearMateria(nuevaMateria.value.trim())
  nuevaMateria.value = ''
}

async function eliminarMateria(id) {
  try {
    await materiasService.delete(id)
    timerStore.materias = timerStore.materias.filter(m => m.id !== id)
    // Si la materia eliminada estaba seleccionada en el timer, la limpiamos
    if (timerStore.materiaSeleccionada?.id === id) {
      timerStore.materiaSeleccionada = null
    }
  } catch { /* silent */ }
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}
.settings-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem 3rem;
}
.settings-wrapper {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Cabecera */
.settings-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.settings-back {
  background: none; border: none;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  font-size: 0.85rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0; transition: color 0.2s;
}
.settings-back:hover { color: var(--color-text); }
.settings-title {
  font-family: var(--font-display);
  font-size: 1.3rem; font-weight: 700;
  color: var(--color-text);
}

/* Secciones */
.settings-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.settings-section__titulo {
  font-family: var(--font-display);
  font-size: 1rem; font-weight: 700;
  color: var(--color-text);
  display: flex; align-items: center; gap: 0.5rem;
}
.settings-section__desc {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  margin-top: -0.5rem;
}

/* Tiempos */
.settings-tiempos {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.settings-tiempo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.settings-tiempo__label {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  font-weight: 500;
}
.settings-select {
  background: var(--color-surface-2);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: 0.9rem;
  padding: 0.4rem 0.75rem;
  cursor: pointer; outline: none;
  transition: border-color 0.2s;
  min-width: 100px;
  text-align: center;
}
.settings-select:focus { border-color: var(--color-primary); }

.settings-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.settings-ok {
  font-size: 0.85rem;
  color: var(--color-success);
  display: flex; align-items: center; gap: 0.3rem;
  font-weight: 600;
}

/* Materias */
.settings-materias {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.settings-materia-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-sm);
  padding: 0.6rem 0.85rem;
  transition: border-color 0.2s;
}
.settings-materia-item:hover { border-color: var(--color-border); }
.settings-materia-item__nombre {
  font-size: 0.9rem;
  color: var(--color-text);
}
.settings-materia-item__del {
  background: none; border: none;
  color: var(--color-text-dim);
  cursor: pointer; padding: 0.2rem;
  border-radius: var(--radius-sm);
  transition: color 0.2s, background 0.2s;
  display: flex; align-items: center;
}
.settings-materia-item__del:hover {
  color: var(--color-danger);
  background: rgba(255,94,94,0.1);
}

.settings-materias-vacio {
  font-size: 0.85rem;
  color: var(--color-text-dim);
  text-align: center;
  padding: 0.5rem;
}

.settings-add-materia {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.settings-add-materia__input { flex: 1; }

/* Animación mensaje guardado */
.fade-msg-enter-active, .fade-msg-leave-active { transition: opacity 0.3s ease; }
.fade-msg-enter-from, .fade-msg-leave-to { opacity: 0; }
</style>
