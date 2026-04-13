<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.tipo}`"
          @click="toastStore.remove(toast.id)"
          role="alert"
        >
          <i class="toast__icono" :class="iconoClase(toast.tipo)"></i>
          <span class="toast__mensaje">{{ toast.mensaje }}</span>
          <button class="toast__cerrar" aria-label="Cerrar">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toastStore'

const toastStore = useToastStore()

function iconoClase(tipo) {
  const map = {
    success: 'pi pi-check-circle',
    error:   'pi pi-times-circle',
    warning: 'pi pi-exclamation-triangle',
    info:    'pi pi-info-circle'
  }
  return map[tipo] ?? map.info
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: center;
  pointer-events: none;
  width: 100%;
  max-width: 400px;
  padding: 0 1rem;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 500;
  width: 100%;
  cursor: pointer;
  pointer-events: all;
  box-shadow: var(--shadow-md);
  border: 1px solid transparent;
}

.toast--success {
  background: rgba(78, 203, 113, 0.15);
  border-color: rgba(78, 203, 113, 0.4);
  color: var(--color-success);
}
.toast--error {
  background: rgba(255, 94, 94, 0.15);
  border-color: rgba(255, 94, 94, 0.4);
  color: var(--color-danger);
}
.toast--warning {
  background: rgba(245, 166, 35, 0.15);
  border-color: rgba(245, 166, 35, 0.4);
  color: var(--color-accent);
}
.toast--info {
  background: rgba(124, 92, 252, 0.15);
  border-color: rgba(124, 92, 252, 0.4);
  color: var(--color-primary);
}

.toast__icono { font-size: 1rem; flex-shrink: 0; }
.toast__mensaje { flex: 1; }
.toast__cerrar {
  background: none; border: none;
  color: currentColor; opacity: 0.6;
  cursor: pointer; padding: 0;
  display: flex; align-items: center;
  font-size: 0.75rem;
  flex-shrink: 0;
}
.toast__cerrar:hover { opacity: 1; }

/* Animación */
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from   { opacity: 0; transform: translateY(16px) scale(0.95); }
.toast-leave-to     { opacity: 0; transform: translateY(8px) scale(0.97); }
</style>
