<template>
  <div class="timer-clock" :class="[tipoClass, { 'timer-clock--corriendo': corriendo }]">
    <svg
      class="timer-clock__svg"
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        class="timer-clock__track"
        cx="120" cy="120" :r="radio"
        stroke-width="8" fill="none"
      />
      <circle
        class="timer-clock__arc"
        cx="120" cy="120" :r="radio"
        stroke-width="8" fill="none"
        stroke-linecap="round"
        :stroke-dasharray="circunferencia"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <div class="timer-clock__display">
      <span class="timer-clock__time">{{ minutos }}:{{ segundos }}</span>
      <span class="timer-clock__tipo">{{ tipoLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  minutos:     { type: String, required: true },
  segundos:    { type: String, required: true },
  progresoPct: { type: Number, default: 0 },
  tipo:        { type: String, default: 'TRABAJO' },
  corriendo:   { type: Boolean, default: false }
})

const radio          = 104
const circunferencia = 2 * Math.PI * radio

const dashOffset = computed(() =>
  circunferencia * (1 - props.progresoPct / 100)
)

const tipoClass = computed(() => {
  const map = {
    TRABAJO:        'timer-clock--trabajo',
    DESCANSO_CORTO: 'timer-clock--descanso-corto',
    DESCANSO_LARGO: 'timer-clock--descanso-largo'
  }
  return map[props.tipo] ?? 'timer-clock--trabajo'
})

const tipoLabel = computed(() => {
  const map = {
    TRABAJO:        'TRABAJO',
    DESCANSO_CORTO: 'DESCANSO CORTO',
    DESCANSO_LARGO: 'DESCANSO LARGO'
  }
  return map[props.tipo] ?? ''
})
</script>

<style scoped>
.timer-clock {
  position: relative;
  width: 240px;
  height: 240px;
  flex-shrink: 0;
}

.timer-clock__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.timer-clock__track { stroke: var(--color-surface-2); }

.timer-clock__arc {
  stroke: var(--color-primary);
  transition: stroke-dashoffset 0.95s linear;
  filter: drop-shadow(0 0 10px var(--color-primary-glow));
}

/* Variantes de color */
.timer-clock--descanso-corto .timer-clock__arc {
  stroke: var(--color-success);
  filter: drop-shadow(0 0 10px rgba(78,203,113,0.35));
}
.timer-clock--descanso-largo .timer-clock__arc {
  stroke: var(--color-accent);
  filter: drop-shadow(0 0 10px rgba(245,166,35,0.35));
}

/* Pulso mientras corre */
.timer-clock--corriendo .timer-clock__arc {
  animation: pulso 2.5s ease-in-out infinite;
}
.timer-clock--corriendo.timer-clock--descanso-corto .timer-clock__arc {
  animation: pulso-verde 2.5s ease-in-out infinite;
}
.timer-clock--corriendo.timer-clock--descanso-largo .timer-clock__arc {
  animation: pulso-naranja 2.5s ease-in-out infinite;
}

@keyframes pulso {
  0%, 100% { filter: drop-shadow(0 0 8px var(--color-primary-glow)); }
  50%       { filter: drop-shadow(0 0 20px rgba(124,92,252,0.5)); }
}
@keyframes pulso-verde {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(78,203,113,0.3)); }
  50%       { filter: drop-shadow(0 0 20px rgba(78,203,113,0.6)); }
}
@keyframes pulso-naranja {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(245,166,35,0.3)); }
  50%       { filter: drop-shadow(0 0 20px rgba(245,166,35,0.6)); }
}

/* Display */
.timer-clock__display {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0.3rem; pointer-events: none;
}
.timer-clock__time {
  font-family: var(--font-mono);
  font-size: 3rem; font-weight: 700;
  color: var(--color-text);
  letter-spacing: 0.04em; line-height: 1;
}
.timer-clock__tipo {
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-text-dim);
  text-transform: uppercase;
}

@media (max-width: 380px) {
  .timer-clock { width: 200px; height: 200px; }
  .timer-clock__time { font-size: 2.4rem; }
}
</style>
