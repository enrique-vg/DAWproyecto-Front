<template>
  <div class="skeleton-wrapper">
    <!-- Resumen skeleton -->
    <div class="skeleton-resumen">
      <div class="skeleton-card">
        <div class="skeleton skeleton--valor"></div>
        <div class="skeleton skeleton--label"></div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton skeleton--valor"></div>
        <div class="skeleton skeleton--label"></div>
      </div>
    </div>

    <!-- Gráfico skeleton -->
    <div class="skeleton-grafico">
      <div class="skeleton-grafico__barras">
        <div
          v-for="i in barras"
          :key="i"
          class="skeleton skeleton-grafico__barra"
          :style="{ height: `${alturas[i - 1]}%`, animationDelay: `${i * 0.06}s` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Alturas aleatorias fijas para que no cambien en cada render
const barras  = 7
const alturas = [45, 70, 55, 85, 40, 65, 50]
</script>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Animación shimmer */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-2) 25%,
    var(--color-border)    50%,
    var(--color-surface-2) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Resumen */
.skeleton-resumen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.skeleton-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.25rem 1rem;
  display: flex; flex-direction: column;
  align-items: center; gap: 0.5rem;
}
.skeleton--valor {
  width: 60px; height: 2.2rem;
  border-radius: var(--radius-sm);
}
.skeleton--label {
  width: 80px; height: 0.7rem;
}

/* Gráfico */
.skeleton-grafico {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  height: 250px;
  display: flex; align-items: flex-end;
}
.skeleton-grafico__barras {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
}
.skeleton-grafico__barra {
  flex: 1;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  min-height: 20%;
}
</style>
