<template>
  <div class="auth-layout">
    <!-- Fondo con orb difuminado -->
    <div class="auth-layout__bg" aria-hidden="true">
      <div class="auth-layout__orb"></div>
    </div>

    <!-- Tarjeta central -->
    <div class="auth-layout__card">
      <!-- Botón volver -->
      <RouterLink to="/" class="auth-layout__back">
        <i class="pi pi-arrow-left"></i> Volver
      </RouterLink>

      <!-- Logo -->
      <div class="auth-layout__logo">
        <svg class="auth-layout__logo-icon" viewBox="0 0 64 64" fill="none" aria-label="PomoTanks logo">
          <rect x="10" y="34" width="44" height="18" rx="4" fill="currentColor"/>
          <rect x="14" y="22" width="22" height="13" rx="3" fill="currentColor" opacity="0.8"/>
          <rect x="35" y="25" width="16" height="6" rx="2" fill="currentColor" opacity="0.6"/>
          <rect x="44" y="24" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
          <circle cx="20" cy="52" r="5" fill="var(--color-surface)" stroke="currentColor" stroke-width="2"/>
          <circle cx="32" cy="52" r="5" fill="var(--color-surface)" stroke="currentColor" stroke-width="2"/>
          <circle cx="44" cy="52" r="5" fill="var(--color-surface)" stroke="currentColor" stroke-width="2"/>
        </svg>        <span class="auth-layout__logo-text">PomoTanks</span>
      </div>

      <!-- Contenido específico de cada vista (Login / Register) -->
      <slot />
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.auth-layout__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.auth-layout__orb {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: var(--color-primary);
  filter: blur(120px);
  opacity: 0.12;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.auth-layout__card {
  position: relative;
  z-index: 1;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-md);
  animation: fadeUp 0.4s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.auth-layout__back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin-bottom: 1.75rem;
  transition: color 0.2s;
  text-decoration: none !important;
}
.auth-layout__back:hover { color: var(--color-text); }

.auth-layout__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.auth-layout__logo-icon {
  width: 56px;
  height: 56px;
  color: var(--color-primary);
  filter: drop-shadow(0 0 12px var(--color-primary-glow));
}

.auth-layout__logo-text {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--color-text);
}
</style>
