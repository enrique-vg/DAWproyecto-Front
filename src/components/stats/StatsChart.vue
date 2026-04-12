<template>
  <div class="stats-chart">
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="stats-chart__vacio">
      Sin datos para este período
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps({
  datos: { type: Object, default: null }
  // Espera: { labels: string[], datos: number[] }
})

const chartData = computed(() => {
  if (!props.datos?.labels?.length) return null
  return {
    labels: props.datos.labels,
    datasets: [{
      label: 'Minutos trabajados',
      data: props.datos.datos,
      backgroundColor: 'rgba(124, 92, 252, 0.7)',
      borderColor: 'rgba(124, 92, 252, 1)',
      borderWidth: 1.5,
      borderRadius: 6,
      borderSkipped: false
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#17171f',
      borderColor: '#2a2a3a',
      borderWidth: 1,
      titleColor: '#eeeef5',
      bodyColor: '#7b7b9a',
      callbacks: {
        label: (ctx) => ` ${ctx.raw} min`
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(42,42,58,0.5)' },
      ticks: {
        color: '#7b7b9a',
        font: { family: "'Syne', sans-serif", size: 11 }
      }
    },
    y: {
      grid: { color: 'rgba(42,42,58,0.5)' },
      beginAtZero: true,
      ticks: {
        color: '#7b7b9a',
        font: { family: "'Syne', sans-serif", size: 11 },
        callback: (v) => `${v}m`
      }
    }
  }
}
</script>

<style scoped>
.stats-chart {
  width: 100%;
  height: 220px;
  position: relative;
}

.stats-chart__vacio {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-dim);
  font-size: 0.9rem;
}
</style>
