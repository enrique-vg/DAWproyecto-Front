<template>
  <div class="stats-page">
    <AppNav />

    <main class="stats-main">
      <div class="stats-wrapper">

        <div class="stats-nav">
          <button class="stats-nav__back" @click="router.push({ name: 'timer' })" aria-label="Volver al timer">
            <i class="pi pi-arrow-left" aria-hidden="true"></i> Volver
          </button>
          <span class="stats-nav__hora" aria-label="Hora actual">{{ horaActual }}</span>
        </div>

        <!-- Tabs de periodo -->
        <div class="stats-tabs" role="tablist" aria-label="Periodo de estadísticas">
          <button
            v-for="p in periodos" :key="p.valor"
            class="stats-tab"
            :class="{ active: statsStore.periodoActivo === p.valor }"
            role="tab"
            :aria-selected="statsStore.periodoActivo === p.valor"
            @click="statsStore.cargarProgreso(p.valor)"
          >
            {{ p.label }}
          </button>
        </div>

        <!-- Navegación de fecha -->
        <div class="stats-fecha" role="navigation" aria-label="Navegación de fechas">
          <button class="stats-fecha__btn" @click="statsStore.navegarFecha(-1)" aria-label="Periodo anterior">
            <i class="pi pi-angle-left" aria-hidden="true"></i>
          </button>
          <span class="stats-fecha__label">{{ fechaFormateada }}</span>
          <button
            class="stats-fecha__btn"
            :disabled="statsStore.esFechaFutura"
            @click="statsStore.navegarFecha(1)"
            aria-label="Periodo siguiente"
          >
            <i class="pi pi-angle-right" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Skeleton / Error / Datos -->
        <Transition name="fade" mode="out-in">

          <StatsSkeleton v-if="statsStore.loading" key="skeleton" />

          <div v-else-if="hayError" key="error" class="stats-error">
            <i class="pi pi-exclamation-circle stats-error__icono" aria-hidden="true"></i>
            <p class="stats-error__titulo">No se pudieron cargar los datos</p>
            <p class="stats-error__desc">Comprueba tu conexión e inténtalo de nuevo.</p>
            <button class="btn btn--ghost btn--md" @click="statsStore.cargarProgreso()">
              <i class="pi pi-refresh" style="margin-right:0.4rem"></i>
              Reintentar
            </button>
          </div>

          <div v-else key="datos" class="stats-datos">

            <!-- Fila superior: sesiones + tanques -->
            <div class="stats-resumen">

              <!-- Sesiones -->
              <div class="stats-resumen__card">
                <span class="stats-resumen__valor">
                  {{ statsStore.progreso?.totalSesiones ?? '–' }}
                </span>
                <span class="stats-resumen__etiqueta">Sesiones</span>
              </div>

              <!-- Tanques -->
              <div class="stats-resumen__card stats-resumen__card--tanques">
                <div class="stats-tanques">
                  <img
                    src="@/assets/0Tanque_Futurista.png"
                    alt="Tanques"
                    class="stats-tanques__img"
                  />
                  <span class="stats-tanques__contador">
                    ×{{ statsStore.progreso?.totalSesiones ?? 0 }}
                  </span>
                </div>
                <span class="stats-resumen__etiqueta">Tanques</span>
              </div>

            </div>

            <!-- Gráfico -->
            <div class="stats-card">
              <div
                v-if="!statsStore.progreso?.grafico?.datos?.some(d => d > 0)"
                class="stats-empty"
                role="status"
              >
                <i class="pi pi-chart-bar stats-empty__icono" aria-hidden="true"></i>
                <p class="stats-empty__texto">Sin actividad en este periodo</p>
                <p class="stats-empty__sub">¡Completa tu primer pomodoro!</p>
              </div>
              <StatsChart v-else :datos="statsStore.progreso?.grafico ?? null" />
            </div>

            <!-- Fila inferior: tiempo total + hito de rango -->
            <div class="stats-inferior">

              <!-- Tiempo total -->
              <div class="stats-inferior__card">
                <div class="stats-inferior__icono" aria-hidden="true">
                  <i class="pi pi-clock"></i>
                </div>
                <div class="stats-inferior__info">
                  <p class="stats-inferior__valor">{{ tiempoFormateado }}</p>
                  <p class="stats-inferior__etiqueta">Tiempo total</p>
                </div>
              </div>

              <!-- Hito de rango -->
              <div
                v-if="hitoRango"
                class="stats-inferior__card stats-inferior__card--hito"
              >
                <div class="stats-inferior__icono" aria-hidden="true">
                  <i class="pi pi-star-fill"></i>
                </div>
                <div class="stats-inferior__info">
                  <p class="stats-inferior__valor stats-inferior__valor--hito">
                    {{ hitoRango.descripcion }}
                  </p>
                  <p class="stats-inferior__etiqueta">{{ formatearFecha(hitoRango.fecha) }}</p>
                </div>
              </div>

              <!-- Empty state hito -->
              <div v-else class="stats-inferior__card stats-inferior__card--vacio">
                <div class="stats-inferior__icono" aria-hidden="true">
                  <i class="pi pi-trophy"></i>
                </div>
                <div class="stats-inferior__info">
                  <p class="stats-inferior__valor">–</p>
                  <p class="stats-inferior__etiqueta">Sin hitos aún</p>
                </div>
              </div>

            </div>

          </div>
        </Transition>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNav        from '@/components/ui/AppNav.vue'
import StatsChart    from '@/components/stats/StatsChart.vue'
import StatsSkeleton from '@/components/stats/StatsSkeleton.vue'
import { useStatsStore } from '@/stores/statsStore'

const router     = useRouter()
const statsStore = useStatsStore()

const periodos = [
  { label: 'Día',    valor: 'dia' },
  { label: 'Semana', valor: 'semana' },
  { label: 'Mes',    valor: 'mes' },
  { label: 'Año',    valor: 'año' }
]

const horaActual = ref('')
function actualizarHora() {
  horaActual.value = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(() => {
  statsStore.cargarProgreso()
  statsStore.cargarHitos()
  actualizarHora()
  setInterval(actualizarHora, 30000)
})

const hayError    = computed(() => !statsStore.loading && statsStore.progreso === null)
const hitoRango   = computed(() => statsStore.hitos?.[0] ?? null)

const fechaFormateada = computed(() => {
  const d = new Date(statsStore.fechaActiva + 'T12:00:00')
  const p = statsStore.periodoActivo
  if (p === 'dia')
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  if (p === 'semana') {
    const ini = new Date(d); ini.setDate(d.getDate() - d.getDay() + 1)
    const fin = new Date(ini); fin.setDate(ini.getDate() + 6)
    return `${ini.getDate()}–${fin.getDate()} ${fin.toLocaleDateString('es-ES', { month: 'short' })}`
  }
  if (p === 'mes')
    return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  return d.getFullYear().toString()
})

const tiempoFormateado = computed(() => {
  const mins = statsStore.progreso?.totalTiempo
  if (!mins) return '–'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
})

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}
</script>

<style scoped>
.stats-page { min-height: 100vh; min-height: 100dvh; display: flex; flex-direction: column; background: var(--color-bg); }
.stats-main { flex: 1; display: flex; justify-content: center; padding: 1.5rem var(--page-padding) 3rem; }
.stats-wrapper { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 1.25rem; }

/* Nav */
.stats-nav { display: flex; align-items: center; justify-content: space-between; }
.stats-nav__back {
  background: none; border: none; color: var(--color-text-muted);
  font-family: var(--font-display); font-size: 0.85rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0; transition: color 0.2s; min-height: 44px;
}
.stats-nav__back:hover { color: var(--color-text); }
.stats-nav__hora { font-family: var(--font-mono); font-size: 1rem; color: var(--color-text-muted); }

/* Tabs */
.stats-tabs {
  display: flex; background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-full);
  padding: 3px; gap: 2px;
}
.stats-tab {
  flex: 1; padding: 0.42rem 0; border-radius: var(--radius-full);
  background: none; border: none; color: var(--color-text-muted);
  font-family: var(--font-display); font-size: 0.82rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; min-height: 40px;
}
.stats-tab.active { background: var(--color-primary); color: #fff; }
.stats-tab:not(.active):hover { color: var(--color-text); }

/* Fecha */
.stats-fecha {
  display: flex; align-items: center; background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  padding: 0.5rem 0.75rem; gap: 0.5rem;
}
.stats-fecha__btn {
  background: none; border: none; color: var(--color-text-muted); cursor: pointer;
  width: 36px; height: 36px; border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; transition: all 0.2s; flex-shrink: 0;
}
.stats-fecha__btn:hover:not(:disabled) { color: var(--color-text); background: var(--color-surface-2); }
.stats-fecha__btn:disabled { opacity: 0.3; cursor: not-allowed; }
.stats-fecha__label { flex: 1; text-align: center; font-size: 0.85rem; color: var(--color-text-muted); text-transform: capitalize; }

/* Error */
.stats-error {
  background: var(--color-surface); border: 1px solid rgba(255,94,94,0.3);
  border-radius: var(--radius-md); padding: 2.5rem 1rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center;
}
.stats-error__icono { font-size: 2rem; color: var(--color-danger); }
.stats-error__titulo { font-weight: 700; color: var(--color-text); }
.stats-error__desc { font-size: 0.85rem; color: var(--color-text-muted); }

/* Datos */
.stats-datos { display: flex; flex-direction: column; gap: 1.25rem; }

/* Fila superior: sesiones + tanques */
.stats-resumen {
  display: grid;
  grid-template-columns: 1fr 1.4fr; /* tanques un poco más ancho */
  gap: 0.75rem;
}
.stats-resumen__card {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: 1.25rem 1rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
}
.stats-resumen__valor {
  font-family: var(--font-mono); font-size: 1.8rem; font-weight: 700;
  color: var(--color-primary);
}
.stats-resumen__etiqueta {
  font-size: 0.72rem; color: var(--color-text-dim);
  text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;
}

/* Tarjeta tanques */
.stats-resumen__card--tanques {
  padding: 1rem;
}
.stats-tanques {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.stats-tanques__img {
  width: 64px;
  mix-blend-mode: lighten;
  opacity: 0.9;
  filter: drop-shadow(0 0 8px rgba(124,92,252,0.3));
}
.stats-tanques__contador {
  font-family: var(--font-mono);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
}

/* Gráfico */
.stats-card {
  background: var(--color-surface); border: 1px solid var(--color-border);
  border-radius: var(--radius-md); padding: 1.25rem;
}
.stats-empty {
  height: 220px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 0.5rem;
}
.stats-empty__icono { font-size: 2rem; color: var(--color-text-dim); }
.stats-empty__texto { font-size: 0.92rem; font-weight: 600; color: var(--color-text-muted); }
.stats-empty__sub { font-size: 0.8rem; color: var(--color-text-dim); }

/* Fila inferior: tiempo + hito */
.stats-inferior {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.stats-inferior__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.stats-inferior__card--hito {
  border-color: var(--color-border);
}
.stats-inferior__card--vacio {
  opacity: 0.5;
}
.stats-inferior__icono {
  width: 36px; height: 36px;
  background: var(--color-surface-2);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-primary);
  font-size: 1rem;
  flex-shrink: 0;
}
.stats-inferior__card--hito .stats-inferior__icono {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}
.stats-inferior__info {
  display: flex; flex-direction: column; gap: 0.15rem;
  overflow: hidden;
}
.stats-inferior__valor {
  font-family: var(--font-mono);
  font-size: 1.1rem; font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}
.stats-inferior__valor--hito {
  font-family: var(--font-display);
  font-size: 0.82rem; font-weight: 600;
  color: var(--color-text);
  white-space: normal;
  line-height: 1.3;
}
.stats-inferior__etiqueta {
  font-size: 0.7rem; color: var(--color-text-dim);
  text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600;
}

/* Transición */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
