<template>
  <div class="timer-config">

    <!-- Selector de materia + botón añadir -->
    <div class="config-row">
      <Dropdown
        v-model="timerStore.materiaSeleccionada"
        :options="timerStore.materias"
        option-label="nombre"
        placeholder="Elige Materia"
        class="config-dropdown"
      />
      <button
        class="config-add-btn"
        @click="abrirModal"
        title="Nueva materia"
        aria-label="Añadir materia"
      >
        <i class="pi pi-plus"></i>
      </button>
    </div>

    <!-- Selectores de tiempo -->
    <div class="config-tiempos">
      <div class="config-tiempo">
        <label class="config-tiempo__label">Trabajo</label>
        <select
          v-model.number="timerStore.config.tiempoTrabajo"
          class="config-select"
          @change="timerStore.actualizarSegundos()"
        >
          <option v-for="t in [15,20,25,30,45,50,60]" :key="t" :value="t">{{ t }} min</option>
        </select>
      </div>
      <div class="config-tiempo">
        <label class="config-tiempo__label">Desc. corto</label>
        <select
          v-model.number="timerStore.config.tiempoDescansoCorto"
          class="config-select"
        >
          <option v-for="t in [3,5,10]" :key="t" :value="t">{{ t }} min</option>
        </select>
      </div>
      <div class="config-tiempo">
        <label class="config-tiempo__label">Desc. largo</label>
        <select
          v-model.number="timerStore.config.tiempoDescansoLargo"
          class="config-select"
        >
          <option v-for="t in [10,15,20,30]" :key="t" :value="t">{{ t }} min</option>
        </select>
      </div>
    </div>

    <!-- Modal: nueva materia -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="modalAbierto"
          class="modal-backdrop"
          @click.self="cerrarModal"
        >
          <div class="modal-card" role="dialog" aria-modal="true">
            <h3 class="modal-card__title">Nueva materia</h3>
            <div class="field">
              <InputText
                v-model="nuevaMateria"
                placeholder="Ej: Matemáticas"
                @keydown.enter="guardarMateria"
                ref="inputMateriaRef"
              />
            </div>
            <div class="modal-card__actions">
              <button class="btn btn--ghost btn--md" @click="cerrarModal">Cancelar</button>
              <button
                class="btn btn--primary btn--md"
                @click="guardarMateria"
                :disabled="!nuevaMateria.trim()"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useTimerStore } from '@/stores/timerStore'

const timerStore      = useTimerStore()
const modalAbierto    = ref(false)
const nuevaMateria    = ref('')
const inputMateriaRef = ref(null)

function abrirModal() {
  modalAbierto.value = true
}
function cerrarModal() {
  modalAbierto.value = false
  nuevaMateria.value = ''
}

async function guardarMateria() {
  if (!nuevaMateria.value.trim()) return
  await timerStore.crearMateria(nuevaMateria.value.trim())
  cerrarModal()
}

// Foco automático al abrir el modal
watch(modalAbierto, async (v) => {
  if (v) {
    await nextTick()
    inputMateriaRef.value?.$el?.focus()
  }
})
</script>

<style scoped>
.timer-config {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

/* Fila materia */
.config-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.config-dropdown { flex: 1; max-width: 240px; }

.config-add-btn {
  background: var(--color-surface-2);
  border: 1.5px solid var(--color-border);
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}
.config-add-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-glow);
}

/* Fila tiempos */
.config-tiempos {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.config-tiempo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}
.config-tiempo__label {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.config-select {
  background: var(--color-surface-2);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: 0.85rem;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
  outline: none;
  text-align: center;
  -webkit-appearance: none;
  transition: border-color 0.2s;
}
.config-select:focus { border-color: var(--color-primary); }

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 300; padding: 1rem;
}
.modal-card {
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  width: 100%; max-width: 320px;
  display: flex; flex-direction: column; gap: 1.25rem;
}
.modal-card__title {
  font-family: var(--font-display);
  font-size: 1.1rem; font-weight: 700;
  color: var(--color-text); text-align: center;
}
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.modal-card__actions {
  display: flex; gap: 0.75rem; justify-content: flex-end;
}

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-card { transform: scale(0.95) translateY(8px); }
</style>
