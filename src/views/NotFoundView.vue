<template>
  <div class="not-found">
    <div class="not-found__bg" aria-hidden="true">
      <div class="not-found__orb"></div>
    </div>

    <div class="not-found__content">
      <div class="not-found__code" aria-hidden="true">404</div>

      <img
        src="@/assets/0Tanque_Futurista.png"
        alt=""
        aria-hidden="true"
        class="not-found__tanque"
      />

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
  min-height: 100vh; min-height: 100dvh;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem; position: relative; overflow: hidden;
  background: var(--color-bg);
}

.not-found__bg { position: absolute; inset: 0; pointer-events: none; }
.not-found__orb {
  position: absolute;
  width: 400px; height: 400px; border-radius: 50%;
  background: var(--color-danger);
  filter: blur(120px); opacity: 0.08;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
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
  font-size: 6rem; font-weight: 700;
  color: var(--color-border);
  line-height: 1; letter-spacing: -0.04em;
}

.not-found__tanque {
  width: 220px;
  mix-blend-mode: lighten;
  opacity: 0.7;
  /* Efecto de tanque perdido: ligeramente inclinado y difuminado */
  filter: blur(0.5px) brightness(0.8);
  animation: perdido 6s ease-in-out infinite alternate;
}

@keyframes perdido {
  from { transform: translateY(0) rotate(-3deg); opacity: 0.6; }
  to   { transform: translateY(-10px) rotate(2deg); opacity: 0.8; }
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
  .not-found__tanque { width: 160px; }
  .not-found__acciones { flex-direction: column; width: 100%; }
  .not-found__acciones .btn { width: 100%; }
}
</style>
