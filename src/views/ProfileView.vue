<template>
  <div class="profile-page">
    <AppNav />

    <main class="profile-main">
      <div class="profile-wrapper">

        <!-- Cabecera -->
        <div class="profile-header">
          <button class="profile-back" @click="router.back()">
            <i class="pi pi-arrow-left"></i> Volver
          </button>
          <h1 class="profile-title">Mi perfil</h1>
        </div>

        <!-- Avatar + nombre -->
        <div class="profile-avatar-section">
          <div class="profile-avatar">
            <span class="profile-avatar__inicial">{{ inicial }}</span>
          </div>
          <div class="profile-avatar__info">
            <p class="profile-avatar__nombre">{{ authStore.user?.nombre }}</p>
            <p class="profile-avatar__email">{{ authStore.user?.email }}</p>
          </div>
        </div>

        <!-- Badge de cuenta -->
        <div class="profile-cuenta">
          <div class="profile-cuenta__badge" :class="authStore.isPremium ? 'premium' : 'free'">
            <i :class="authStore.isPremium ? 'pi pi-star-fill' : 'pi pi-user'"></i>
            <span>{{ authStore.isPremium ? 'Cuenta Premium' : 'Cuenta gratuita' }}</span>
          </div>
          <p v-if="!authStore.isPremium" class="profile-cuenta__upgrade">
            Próximamente podrás desbloquear funciones premium
          </p>
        </div>

        <!-- Stats rápidas -->
        <div class="profile-stats">
          <div class="profile-stat">
            <span class="profile-stat__valor">{{ periodosCompletados }}</span>
            <span class="profile-stat__label">Pomodoros completados esta sesión</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="profile-acciones">
          <RouterLink to="/settings" class="profile-accion">
            <i class="pi pi-cog"></i>
            <span>Ajustes de la aplicación</span>
            <i class="pi pi-angle-right profile-accion__arrow"></i>
          </RouterLink>
        </div>

        <!-- Cerrar sesión -->
        <button class="btn btn--danger btn--lg profile-logout" @click="handleLogout">
          <i class="pi pi-sign-out" style="margin-right: 0.5rem"></i>
          Cerrar sesión
        </button>

      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import AppNav from '@/components/ui/AppNav.vue'
import { useAuthStore } from '@/stores/authStore'
import { useTimerStore } from '@/stores/timerStore'

const router     = useRouter()
const authStore  = useAuthStore()
const timerStore = useTimerStore()

const inicial = computed(() =>
  authStore.user?.nombre?.charAt(0).toUpperCase() ?? '?'
)

const periodosCompletados = computed(() => timerStore.periodosCompletados)

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'welcome' })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.profile-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem 3rem;
}

.profile-wrapper {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Cabecera */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.profile-back {
  background: none; border: none;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  font-size: 0.85rem; cursor: pointer;
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0; transition: color 0.2s;
}
.profile-back:hover { color: var(--color-text); }
.profile-title {
  font-family: var(--font-display);
  font-size: 1.3rem; font-weight: 700;
  color: var(--color-text);
}

/* Avatar */
.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}
.profile-avatar {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 20px var(--color-primary-glow);
}
.profile-avatar__inicial {
  font-family: var(--font-display);
  font-size: 1.6rem; font-weight: 800;
  color: #fff;
}
.profile-avatar__nombre {
  font-family: var(--font-display);
  font-size: 1.1rem; font-weight: 700;
  color: var(--color-text);
}
.profile-avatar__email {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: 0.2rem;
}

/* Badge cuenta */
.profile-cuenta {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.profile-cuenta__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  width: fit-content;
}
.profile-cuenta__badge.free {
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}
.profile-cuenta__badge.premium {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}
.profile-cuenta__upgrade {
  font-size: 0.8rem;
  color: var(--color-text-dim);
}

/* Stats */
.profile-stats {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
}
.profile-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.profile-stat__valor {
  font-family: var(--font-mono);
  font-size: 2.2rem; font-weight: 700;
  color: var(--color-primary);
}
.profile-stat__label {
  font-size: 0.78rem;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  text-align: center;
}

/* Acciones */
.profile-acciones {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.profile-accion {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  color: var(--color-text-muted);
  text-decoration: none !important;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}
.profile-accion:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}
.profile-accion__arrow {
  margin-left: auto;
  font-size: 0.9rem;
  opacity: 0.5;
}

/* Logout */
.profile-logout {
  margin-top: 0.5rem;
}
</style>
