<template>
  <div class="app-loader" aria-label="Cargando aplicación" role="status">
    <div class="app-loader__content">
      <div class="app-loader__logo" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <rect x="12" y="32" width="40" height="18" rx="4" fill="currentColor"/>
          <rect x="20" y="24" width="24" height="12" rx="3" fill="currentColor" opacity="0.8"/>
          <rect x="28" y="16" width="18" height="6" rx="2" fill="currentColor" opacity="0.6"/>
          <circle cx="20" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2"/>
          <circle cx="32" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2"/>
          <circle cx="44" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      <p class="app-loader__nombre">PomoTanks</p>
      <div class="app-loader__dots" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-loader {
  position: fixed;
  inset: 0;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.app-loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.app-loader__logo {
  width: 72px;
  height: 72px;
  color: var(--color-primary);
  filter: drop-shadow(0 0 20px var(--color-primary-glow));
  animation: pulso 1.8s ease-in-out infinite;
}

@keyframes pulso {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(0.96); }
}

.app-loader__nombre {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

/* Tres puntos animados */
.app-loader__dots {
  display: flex;
  gap: 0.4rem;
}
.app-loader__dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: bote 1.2s ease-in-out infinite;
}
.app-loader__dots span:nth-child(1) { animation-delay: 0s; }
.app-loader__dots span:nth-child(2) { animation-delay: 0.2s; }
.app-loader__dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bote {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1);   opacity: 1; }
}
</style>
