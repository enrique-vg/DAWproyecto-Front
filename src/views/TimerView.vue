<template>
  <div class="timer-page">
    <AppNav />

    <main class="timer-main">
      <Transition name="slide-up" mode="out-in">

        <CompletadoPanel
          v-if="timerStore.estado === timerStore.ESTADO.COMPLETADO"
          key="completado"
        />

        <div class="timer-wrapper" v-else key="timer">

          <Transition name="colapsar">
            <TimerConfig v-if="timerStore.estado === timerStore.ESTADO.IDLE" />
          </Transition>

          <TimerClock
            :minutos="timerStore.minutos"
            :segundos="timerStore.segundos"
            :progreso-pct="timerStore.progresoPct"
            :tipo="timerStore.tipoPeriodo"
            :corriendo="timerStore.estado === timerStore.ESTADO.CORRIENDO"
          />

          <button
            v-if="timerStore.estado === timerStore.ESTADO.IDLE"
            class="btn btn--primary timer-btn"
            @click="timerStore.empezar()"
          >
            Empezar
          </button>
          <button
            v-else-if="timerStore.estado === timerStore.ESTADO.CORRIENDO"
            class="btn btn--danger timer-btn"
            @click="handleParar"
          >
            Parar
          </button>
          <button
            v-else-if="timerStore.estado === timerStore.ESTADO.PAUSADO"
            class="btn btn--primary timer-btn"
            @click="timerStore.reanudar()"
          >
            Reanudar
          </button>

          <div class="timer-mascota">
            <div class="timer-mascota__img" aria-hidden="true">
              <svg viewBox="0 0 120 80" fill="none">
                <rect x="20" y="44" width="80" height="26" rx="6"
                  fill="var(--color-surface-2)" stroke="var(--color-border)" stroke-width="1.5"/>
                <rect x="32" y="32" width="52" height="18" rx="4"
                  fill="var(--color-surface-2)" stroke="var(--color-border)" stroke-width="1.5"/>
                <rect x="50" y="22" width="36" height="12" rx="3"
                  fill="var(--color-surface-2)" stroke="var(--color-border)" stroke-width="1.5"/>
                <circle cx="34" cy="72" r="7"
                  fill="var(--color-bg)" stroke="var(--color-primary)" stroke-width="2"/>
                <circle cx="60" cy="72" r="7"
                  fill="var(--color-bg)" stroke="var(--color-primary)" stroke-width="2"/>
                <circle cx="86" cy="72" r="7"
                  fill="var(--color-bg)" stroke="var(--color-primary)" stroke-width="2"/>
                <circle cx="62" cy="39" r="2.5" fill="var(--color-primary)"/>
                <circle cx="74" cy="39" r="2.5" fill="var(--color-primary)"/>
              </svg>
            </div>
            <p class="timer-mascota__texto">{{ textoMascota }}</p>
          </div>

        </div>
      </Transition>
    </main>

    <AbandonarModal v-model="mostrarAbandonar" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppNav          from '@/components/ui/AppNav.vue'
import TimerConfig     from '@/components/timer/TimerConfig.vue'
import TimerClock      from '@/components/timer/TimerClock.vue'
import CompletadoPanel from '@/components/timer/CompletadoPanel.vue'
import AbandonarModal  from '@/components/timer/AbandonarModal.vue'
import { useTimerStore } from '@/stores/timerStore'

const timerStore       = useTimerStore()
const mostrarAbandonar = ref(false)

onMounted(async () => {
  await timerStore.cargarConfig()
  await timerStore.cargarMaterias()
})

function handleParar() {
  timerStore.parar()
  mostrarAbandonar.value = true
}

const textoMascota = computed(() => {
  const e = timerStore.estado
  const t = timerStore.tipoPeriodo
  if (e === timerStore.ESTADO.IDLE)    return '¡Listo para conquistar el tiempo!'
  if (t === timerStore.TIPO.TRABAJO)   return '¡Tú puedes! Mantén el foco.'
  return '¡Descansa, lo mereces!'
})
</script>

<style scoped>
.timer-page {
  min-height: 100vh; min-height: 100dvh;
  display: flex; flex-direction: column;
  background: var(--color-bg);
}

.timer-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem var(--page-padding);
}

.timer-wrapper {
  display: flex; flex-direction: column;
  align-items: center; gap: 1.5rem;
  width: 100%; max-width: 420px;
}

.timer-btn { width: 200px; padding: 0.9rem 0; }

.timer-mascota { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.timer-mascota__img { width: 120px; height: 80px; }
.timer-mascota__texto {
  font-size: 0.85rem; color: var(--color-text-muted);
  text-align: center; font-style: italic;
}

/* Móvil: alinear arriba para aprovechar espacio vertical */
@media (max-width: 480px) {
  .timer-main {
    align-items: flex-start;
    padding-top: 1.25rem;
  }
  .timer-wrapper { gap: 1.25rem; }
  .timer-btn { width: 100%; max-width: 260px; }
}

.colapsar-enter-active, .colapsar-leave-active {
  transition: all 0.3s ease; overflow: hidden;
}
.colapsar-enter-from, .colapsar-leave-to {
  opacity: 0; max-height: 0; transform: translateY(-8px);
}
.colapsar-enter-to, .colapsar-leave-from { max-height: 220px; }

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to   { opacity: 0; transform: translateY(-20px); }
</style>
