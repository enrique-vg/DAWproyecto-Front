<template>
  <div class="welcome">
    <div class="welcome__bg" aria-hidden="true">
      <div class="welcome__orb welcome__orb--1"></div>
      <div class="welcome__orb welcome__orb--2"></div>
    </div>

    <div class="welcome__content">
      <div class="welcome__logo">
        <div class="welcome__logo-icon">
          <!-- <img src="../assets/tanque-futurista.png" height="88" width="88" alt="imagen de tanque futurista"> -->
          <svg viewBox="0 0 64 64" fill="none" aria-label="PomoTanks">
            <rect x="10" y="34" width="44" height="18" rx="4" fill="currentColor"/>
            <rect x="14" y="22" width="22" height="13" rx="3" fill="currentColor" opacity="0.8"/>
            <rect x="35" y="25" width="16" height="6" rx="2" fill="currentColor" opacity="0.6"/>
            <rect x="44" y="24" width="8" height="8" rx="2" fill="currentColor" opacity="0.6"/>
            <circle cx="20" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2"/>
            <circle cx="32" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2"/>
            <circle cx="44" cy="52" r="5" fill="var(--color-bg)" stroke="currentColor" stroke-width="2"/>
          </svg>
          <!-- <img src="../assets/tanque-futurista.png" alt="imagen de tanque futurista"> -->
        </div>
        <h1 class="welcome__logo-text">PomoTanks</h1>
      </div>

      <p class="welcome__tagline">
        Conquista tu tiempo.<br/>Un pomodoro a la vez.
      </p>

      <div class="welcome__actions">
        <RouterLink to="/register" class="btn btn--primary btn--lg">
          Crear cuenta nueva
        </RouterLink>
        <RouterLink to="/login" class="btn btn--ghost btn--lg">
          Ya tengo una cuenta
        </RouterLink>
      </div>
    </div>
     <img src="@/assets/0Tanque_Futurista.png"
      alt="imagen de tanque futurista"
      aria-hidden="true"
      class="welcome__tanque"
    />

  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.welcome {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--page-padding);
  position: relative;
  overflow: hidden;
}

.welcome__bg { position: absolute; inset: 0; pointer-events: none; }
.welcome__orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px); opacity: 0.28;
}
.welcome__orb--1 {
  width: 400px; height: 400px;
  background: var(--color-primary);
  top: -100px; right: -100px;
  animation: drift 8s ease-in-out infinite alternate;
}
.welcome__orb--2 {
  width: 300px; height: 300px;
  background: var(--color-accent);
  bottom: -80px; left: -80px;
  animation: drift 10s ease-in-out infinite alternate-reverse;
}
@keyframes drift {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(20px,20px) scale(1.05); }
}
.welcome__tanque {
  position: absolute;
  bottom: -140px;
  right: -120px;
  width: 80%;
  max-width: 1100px;
  min-width: 500px;
  opacity: 0.92;
  pointer-events: none;
  mix-blend-mode: lighten;
  animation: flotar 6s ease-in-out infinite alternate;
  z-index: 0;
  filter: drop-shadow(0 0 15px rgba(124, 92, 252, 0.3));
}
/* Tablet */
@media (max-width: 850px) {
  .welcome__tanque {
    bottom: -80px;
    right: -60px;
    width: 85%;
    min-width: 360px;
    /* opacity: 0.6; */
  }
}

/* Móvil */
@media (max-width: 570px) {
  .welcome__tanque {
    bottom: 20px;
    right: -50px;
    width: 100%;
    min-width: 350px;
    /* opacity: 0.35; */
  }
    .welcome__orb--1 {
    width: 200px;
    height: 200px;
    opacity: 0.6;
  }
  .welcome__orb--2 {
    width: 150px;
    height: 150px;
    opacity: 0.5;
  }
}
.welcome__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 420px;
  width: 100%;
  animation: fadeUp 0.6s ease both;
  /* margin-right: auto; */
  transform: translateY(-100px); 
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.welcome__logo { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
.welcome__logo-icon {
  width: 88px; height: 88px;
  color: var(--color-primary);
  filter: drop-shadow(0 0 24px var(--color-primary-glow));
}
.welcome__logo-text {
  font-family: var(--font-display);
  font-size: 2.75rem; font-weight: 800;
  letter-spacing: -0.02em; color: var(--color-text);
}

.welcome__tagline {
  font-size: 1.1rem; color: var(--color-text-muted);
  text-align: center; line-height: 1.7;
}

.welcome__actions {
  display: flex; flex-direction: column;
  gap: 0.75rem; width: 100%;
}

@media (max-width: 400px) {
  .welcome__logo-text { font-size: 2.2rem; }
  .welcome__logo-icon { width: 72px; height: 72px; }
}
</style>
