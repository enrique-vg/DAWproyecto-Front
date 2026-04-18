<template>
  <div class="not-found">
    <div class="not-found__bg" aria-hidden="true">
      <div class="not-found__orb"></div>
    </div>

    <div class="not-found__content">
      <div class="not-found__code" aria-hidden="true">404</div>

      <div class="not-found__icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <rect x="12" y="32" width="40" height="18" rx="4" fill="currentColor" opacity="0.4"/>
          <rect x="20" y="24" width="24" height="12" rx="3" fill="currentColor" opacity="0.3"/>
          <rect x="28" y="16" width="18" height="6" rx="2" fill="currentColor" opacity="0.2"/>
          <circle cx="20" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2" opacity="0.4"/>
          <circle cx="32" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2" opacity="0.4"/>
          <circle cx="44" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2" opacity="0.4"/>
          <!-- Ojos perdidos -->
          <circle cx="60" cy="20" r="2" fill="var(--color-primary)" opacity="0.6"/>
          <circle cx="55" cy="14" r="1.5" fill="var(--color-primary)" opacity="0.4"/>
          <circle cx="62" cy="12" r="1" fill="var(--color-primary)" opacity="0.3"/>
        </svg>
      </div>

      <h1 class="not-found__titulo">Página no encontrada</h1>
      <p class="not-found__desc">
        Este tanque se ha perdido en la niebla.<br/>
        La página que buscas no existe.
      </p>

      <div class="not-found__acciones">
        <RouterLink to="/timer" class="btn btn--primary btn--md">
          <i class="pi pi-clock" style="margin-right:0.4rem"></i>
          Ir al timer
        </RouterLink>
        <button class="btn btn--ghost btn--md" @click="router.back()">
          <i class="pi pi-arrow-left" style="margin-right:0.4rem"></i>
          Volver atrás
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: var(--color-bg);
}

.not-found__bg {
  position: absolute; inset: 0; pointer-events: none;
}
.not-found__orb {
  position: absolute;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: var(--color-danger);
  filter: blur(120px);
  opacity: 0.08;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.not-found__content {
  position: relative; z-index: 1;
  display: flex; flex-direction: column;
  align-items: center; gap: 1.25rem;
  text-align: center;
  animation: fadeUp 0.5s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.not-found__code {
  font-family: var(--font-mono);
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-border);
  line-height: 1;
  letter-spacing: -0.04em;
}

.not-found__icon {
  width: 80px; height: 80px;
  color: var(--color-primary);
  margin-top: -1rem;
}

.not-found__titulo {
  font-family: var(--font-display);
  font-size: 1.4rem; font-weight: 700;
  color: var(--color-text);
}

.not-found__desc {
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.not-found__acciones {
  display: flex; gap: 0.75rem;
  flex-wrap: wrap; justify-content: center;
  margin-top: 0.5rem;
}

@media (max-width: 360px) {
  .not-found__code { font-size: 4rem; }
  .not-found__acciones { flex-direction: column; width: 100%; }
  .not-found__acciones .btn { width: 100%; }
}
</style>
