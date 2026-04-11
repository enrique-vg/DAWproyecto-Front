<template>
  <div class="completado">
    <div class="completado__card">

      <p class="completado__titular">¡Fenomenal! Lo has conseguido 🎯</p>

      <!-- Badge del pomodoro conseguido -->
      <div class="completado__badge">
        <p class="completado__badge-pre">Has conseguido un...</p>
        <div class="completado__badge-icono" aria-hidden="true">
          <svg viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="36" stroke="var(--color-primary)" stroke-width="2.5"/>
            <path
              d="M26 40l10 10 20-20"
              stroke="var(--color-primary)" stroke-width="3"
              stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </div>
        <p class="completado__badge-valor">Pomodoro #{{ timerStore.periodosCompletados }}</p>
      </div>

      <p class="completado__pregunta">¿Otro más, o tomar un descanso?</p>

      <!-- Acciones principales -->
      <div class="completado__acciones">
        <button class="btn btn--primary btn--md" @click="timerStore.empezar()">
          Uno más
        </button>
        <button class="btn btn--ghost btn--md" @click="timerStore.iniciarDescanso()">
          Descanso
        </button>
      </div>

      <!-- Acción secundaria -->
      <button class="completado__no-complete" @click="timerStore.abandonar()">
        Realmente NO lo completé
      </button>

    </div>

    <!-- Partículas decorativas -->
    <div class="completado__particulas" aria-hidden="true">
      <span
        v-for="i in 10"
        :key="i"
        class="completado__particula"
        :style="particulaStyle(i)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { useTimerStore } from '@/stores/timerStore'

const timerStore = useTimerStore()

function particulaStyle(i) {
  const angle = (i / 10) * 360
  const dist  = 55 + (i % 3) * 20
  const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-success)']
  return {
    '--angle': `${angle}deg`,
    '--dist':  `${dist}px`,
    '--delay': `${i * 0.06}s`,
    '--color': colors[i % colors.length]
  }
}
</script>

<style scoped>
.completado {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
}

/* Card central */
.completado__card {
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  max-width: 340px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  box-shadow: var(--shadow-glow);
  position: relative;
  z-index: 1;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}

.completado__titular {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

/* Badge */
.completado__badge {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-md);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.completado__badge-pre {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}
.completado__badge-icono {
  width: 64px; height: 64px;
}
.completado__badge-valor {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary);
}

.completado__pregunta {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.completado__acciones {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.completado__no-complete {
  background: none; border: none;
  color: var(--color-text-dim);
  font-family: var(--font-display);
  font-size: 0.82rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
  padding: 0;
}
.completado__no-complete:hover { color: var(--color-danger); }

/* Partículas */
.completado__particulas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.completado__particula {
  position: absolute;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--color);
  animation: particula 0.9s ease-out var(--delay) both;
}
@keyframes particula {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% {
    transform:
      translateX(calc(cos(var(--angle)) * var(--dist)))
      translateY(calc(sin(var(--angle)) * var(--dist)))
      scale(0);
    opacity: 0;
  }
}
</style>
