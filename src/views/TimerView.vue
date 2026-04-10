<template>
  <div class="timer-placeholder">
    <div class="timer-placeholder__content">
      <div class="timer-placeholder__icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="var(--color-primary)" stroke-width="2" opacity="0.4"/>
          <circle cx="32" cy="32" r="28" stroke="var(--color-primary)" stroke-width="2"
            stroke-dasharray="176" stroke-dashoffset="44" stroke-linecap="round"/>
          <text x="32" y="37" text-anchor="middle"
            font-family="'Space Mono', monospace"
            font-size="11" fill="var(--color-text)" font-weight="700">
            25:00
          </text>
        </svg>
      </div>
      <h2 class="timer-placeholder__title">¡Bienvenido!</h2>
      <p class="timer-placeholder__sub">El timer estará disponible próximamente.</p>
      <button class="btn btn--ghost btn--md" @click="handleLogout">
        <i class="pi pi-sign-out" style="margin-right:0.4rem"></i>
        Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router    = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'welcome' })
}
</script>

<style scoped>
.timer-placeholder {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--color-bg);
}
.timer-placeholder__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 340px;
  text-align: center;
  animation: fadeUp 0.5s ease both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.timer-placeholder__icon {
  width: 100px;
  height: 100px;
}
.timer-placeholder__title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-text);
}
.timer-placeholder__sub {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}
</style>