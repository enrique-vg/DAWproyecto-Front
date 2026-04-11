<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-backdrop"
        @click.self="handleVolver"
      >
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="abandonar-titulo">
          <h3 class="modal-card__title" id="abandonar-titulo">Abandonar Periodo</h3>
          <p class="modal-card__body">
            Si abandonas, no contará como realizado.<br/>
            <strong>¿Estás seguro?</strong>
          </p>
          <div class="modal-card__actions">
            <button class="btn btn--primary btn--md" @click="handleVolver">
              Volver
            </button>
            <button class="btn btn--ghost btn--md" @click="handleAbandonar">
              Abandonar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useTimerStore } from '@/stores/timerStore'

const props = defineProps({
  modelValue: { type: Boolean, required: true }
})
const emit = defineEmits(['update:modelValue'])

const timerStore = useTimerStore()

function handleVolver() {
  emit('update:modelValue', false)
  timerStore.reanudar()
}

async function handleAbandonar() {
  emit('update:modelValue', false)
  await timerStore.abandonar()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 300; padding: 1rem;
}
.modal-card {
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2.25rem 2rem;
  width: 100%; max-width: 320px;
  text-align: center;
  display: flex; flex-direction: column; gap: 1.25rem;
  box-shadow: var(--shadow-md);
}
.modal-card__title {
  font-family: var(--font-display);
  font-size: 1.2rem; font-weight: 700;
  color: var(--color-text);
}
.modal-card__body {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.65;
}
.modal-card__body strong { color: var(--color-text); }
.modal-card__actions {
  display: flex; gap: 0.75rem; justify-content: center;
}

.modal-enter-active, .modal-leave-active { transition: all 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-card, .modal-leave-to .modal-card {
  transform: scale(0.94) translateY(10px);
}
</style>
