<template>
  <div class="stats-page">
    <AppNav />

    <main class="stats-main">
      <div class="stats-wrapper">

        <!-- Cabecera: volver + reloj -->
        <div class="stats-nav">
          <button class="stats-nav__back" @click="router.push({ name: 'timer' })">
            <i class="pi pi-arrow-left"></i> Volver
          </button>
          <span class="stats-nav__hora">{{ horaActual }}</span>
        </div>

        <!-- Tabs de periodo -->
        <div class="stats-tabs" role="tablist">
          <button
            v-for="p in periodos"
            :key="p.valor"
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
        <div class="stats-fecha">
          <button
            class="stats-fecha__btn"
            @click="statsStore.navegarFecha(-1)"
            aria-label="Periodo anterior"
          >
            <i class="pi pi-angle-left"></i>
          </button>
          <span class="stats-fecha__label">{{ fechaFormateada }}</span>
          <button
            class="stats-fecha__btn"
            :disabled="statsStore.esFechaFutura"
            @click="statsStore.navegarFecha(1)"
            aria-label="Periodo siguiente"
          >
            <i class="pi pi-angle-right"></i>
          </button>
        </div>

        <!-- Resumen numérico -->
        <div class="stats-resumen">
          <div class="stats-resumen__card">
            <span class="stats-resumen__valor">
              <i v-if="statsStore.loading" class="pi pi-spin pi-spinner"></i>
              <template v-else>{{ statsStore.progreso?.totalSesiones ?? '–' }}</template>
            </span>
            <span class="stats-resumen__etiqueta">Sesiones</span>
          </div>
          <div class="stats-resumen__card">
            <span class="stats-resumen__valor">
              <i v-if="statsStore.loading" class="pi pi-spin pi-spinner"></i>
              <template v-else>{{ tiempoFormateado }}</template>
            </span>
            <span class="stats-resumen__etiqueta">Tiempo total</span>
          </div>
        </div>

        <!-- Gráfico -->
        <div class="stats-card">
          <div v-if="statsStore.loading" class="stats-loading">
            <i class="pi pi-spin pi-spinner"></i>
            <span>Cargando...</span>
          </div>
          <StatsChart
            v-else
            :datos="statsStore.progreso?.grafico ?? null"
          />
        </div>

        <!-- Hitos -->
        <div v-if="statsStore.hitos.length" class="stats-hitos">
          <h3 class="stats-hitos__titulo">🏆 Hitos conseguidos</h3>
          <ul class="stats-hitos__lista">
            <li
              v-for="hito in statsStore.hitos"
              :key="hito.id"
              class="hito-item"
            >
              <div class="hito-item__icono">
                <i class="pi pi-star-fill"></i>
              </div>
              <div class="hito-item__info">
                <p class="hito-item__desc">{{ hito.descripcion }}</p>
                <p class="hito-item__fecha">{{ formatearFecha(hito.fecha) }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empty state hitos -->
        <div v-else-if="!statsStore.loading" class="stats-hitos-vacio">
          <i class="pi pi-trophy"></i>
          <p>Completa sesiones para conseguir hitos</p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNav     from '@/components/ui/AppNav.vue'
import StatsChart from '@/components/stats/StatsChart.vue'
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

const fechaFormateada = computed(() => {
  const d = new Date(statsStore.fechaActiva + 'T12:00:00')
  const p = statsStore.periodoActivo
  if (p === 'dia') {
    return d.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long'
    })
  }
  if (p === 'semana') {
    const ini = new Date(d)
    ini.setDate(d.getDate() - d.getDay() + 1)
    const fin = new Date(ini)
    fin.setDate(ini.getDate() + 6)
    return `${ini.getDate()}–${fin.getDate()} ${fin.toLocaleDateString('es-ES', { month: 'short' })}`
  }
  if (p === 'mes') {
    return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }
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
.stats-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}
.stats-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem 3rem;
}
.stats-wrapper {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Cabecera */
.stats-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stats-nav__back {
  background: none; border: none;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  font-size: 0.85rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0; transition: color 0.2s;
}
.stats-nav__back:hover { color: var(--color-text); }
.stats-nav__hora {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--color-text-muted);
}

/* Tabs */
.stats-tabs {
  display: flex;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 3px; gap: 2px;
}
.stats-tab {
  flex: 1; padding: 0.42rem 0;
  border-radius: var(--radius-full);
  background: none; border: none;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  font-size: 0.82rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.stats-tab.active { background: var(--color-primary); color: #fff; }
.stats-tab:not(.active):hover { color: var(--color-text); }

/* Fecha nav */
.stats-fecha {
  display: flex; align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.75rem; gap: 0.5rem;
}
.stats-fecha__btn {
  background: none; border: none;
  color: var(--color-text-muted); cursor: pointer;
  width: 28px; height: 28px;
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; transition: all 0.2s; flex-shrink: 0;
}
.stats-fecha__btn:hover:not(:disabled) {
  color: var(--color-text); background: var(--color-surface-2);
}
.stats-fecha__btn:disabled { opacity: 0.3; cursor: not-allowed; }
.stats-fecha__label {
  flex: 1; text-align: center;
  font-size: 0.85rem; color: var(--color-text-muted);
  text-transform: capitalize;
}

/* Resumen */
.stats-resumen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.stats-resumen__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.25rem 1rem;
  display: flex; flex-direction: column;
  align-items: center; gap: 0.3rem;
}
.stats-resumen__valor {
  font-family: var(--font-mono);
  font-size: 1.8rem; font-weight: 700;
  color: var(--color-primary);
  min-height: 2.2rem;
  display: flex; align-items: center;
}
.stats-resumen__etiqueta {
  font-size: 0.72rem; color: var(--color-text-dim);
  text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;
}

/* Gráfico */
.stats-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
}
.stats-loading {
  height: 220px; display: flex;
  align-items: center; justify-content: center;
  gap: 0.75rem; color: var(--color-text-muted); font-size: 0.9rem;
}

/* Hitos */
.stats-hitos__titulo {
  font-family: var(--font-display);
  font-size: 0.95rem; font-weight: 700;
  color: var(--color-text); margin-bottom: 0.75rem;
}
.stats-hitos__lista { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.hito-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.85rem 1rem;
  display: flex; align-items: center; gap: 0.85rem;
  transition: border-color 0.2s;
}
.hito-item:hover { border-color: var(--color-primary); }
.hito-item__icono {
  width: 32px; height: 32px;
  background: var(--color-accent-soft);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-accent); flex-shrink: 0;
}
.hito-item__desc { font-size: 0.88rem; color: var(--color-text); font-weight: 500; }
.hito-item__fecha { font-size: 0.75rem; color: var(--color-text-dim); margin-top: 0.1rem; }

/* Empty state hitos */
.stats-hitos-vacio {
  display: flex; flex-direction: column;
  align-items: center; gap: 0.5rem;
  padding: 2rem;
  color: var(--color-text-dim);
  font-size: 0.85rem;
}
.stats-hitos-vacio .pi { font-size: 1.5rem; }
</style>
