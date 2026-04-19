<template>
  <nav class="app-nav">

    <div class="app-nav__left" ref="menuRef">
      <button
        class="app-nav__menu-btn"
        @click="menuOpen = !menuOpen"
        aria-label="Menú"
        :aria-expanded="menuOpen"
      >
        <span class="hamburger" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </span>
      </button>

      <Transition name="dropdown">
        <div v-if="menuOpen" class="app-nav__dropdown">
          <RouterLink to="/timer"    class="app-nav__dropdown-item" @click="menuOpen = false">
            <i class="pi pi-clock"></i> Timer
          </RouterLink>
          <RouterLink to="/stats"    class="app-nav__dropdown-item" @click="menuOpen = false">
            <i class="pi pi-chart-bar"></i> Estadísticas
          </RouterLink>
          <div class="app-nav__divider"></div>
          <RouterLink to="/profile"  class="app-nav__dropdown-item" @click="menuOpen = false">
            <i class="pi pi-user"></i> Perfil
          </RouterLink>
          <RouterLink to="/settings" class="app-nav__dropdown-item" @click="menuOpen = false">
            <i class="pi pi-cog"></i> Ajustes
          </RouterLink>
          <div class="app-nav__divider"></div>
          <button class="app-nav__dropdown-item app-nav__dropdown-item--danger" @click="handleLogout">
            <i class="pi pi-sign-out"></i> Cerrar sesión
          </button>
        </div>
      </Transition>
    </div>

    <RouterLink to="/timer" class="app-nav__brand">PomoTanks</RouterLink>

    <div class="app-nav__right">
      <RouterLink to="/timer" class="app-nav__tab" :class="{ active: $route.name === 'timer' }" aria-label="Timer">
        <i class="pi pi-clock"></i>
      </RouterLink>
      <RouterLink to="/stats" class="app-nav__tab" :class="{ active: $route.name === 'stats' }" aria-label="Estadísticas">
        <i class="pi pi-chart-bar"></i>
      </RouterLink>
    </div>

  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router    = useRouter()
const authStore = useAuthStore()
const menuOpen  = ref(false)
const menuRef   = ref(null)

async function handleLogout() {
  menuOpen.value = false
  await authStore.logout()
  router.push({ name: 'welcome' })
}

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  height: 56px;
  background: rgba(14,14,19,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-soft);
}

/* Izquierda */
.app-nav__left { position: relative; width: 80px; }

.app-nav__menu-btn {
  background: none; border: none;
  padding: 0.5rem;
  display: flex; align-items: center; justify-content: center;
  min-width: 44px; min-height: 44px;
}

.hamburger { display: flex; flex-direction: column; gap: 4px; width: 20px; }
.hamburger span {
  display: block; height: 2px;
  background: var(--color-text-muted);
  border-radius: 2px;
  transition: all 0.25s ease;
  transform-origin: center;
}
.hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

/* Dropdown */
.app-nav__dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  min-width: 200px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  z-index: 200;
}

.app-nav__dropdown-item {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.85rem 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-family: var(--font-display);
  font-weight: 500;
  text-decoration: none !important;
  background: none; border: none;
  width: 100%; cursor: pointer;
  transition: background 0.15s, color 0.15s;
  min-height: 48px;
}
.app-nav__dropdown-item:hover { background: var(--color-surface-2); color: var(--color-text); }
.app-nav__dropdown-item.router-link-active { color: var(--color-primary); }
.app-nav__dropdown-item--danger { color: var(--color-danger) !important; }
.app-nav__dropdown-item--danger:hover { background: rgba(255,94,94,0.08) !important; }
.app-nav__divider { height: 1px; background: var(--color-border-soft); margin: 0.2rem 0; }

/* Centro */
.app-nav__brand {
  position: absolute; left: 50%; transform: translateX(-50%);
  font-family: var(--font-display); font-weight: 800;
  font-size: 1.1rem; color: var(--color-text);
  text-decoration: none !important; letter-spacing: -0.01em;
}

/* Derecha */
.app-nav__right { display: flex; gap: 0.25rem; width: 80px; justify-content: flex-end; }

.app-nav__tab {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-text-muted);
  text-decoration: none !important;
  transition: all 0.2s;
  border: 2px solid var(--color-border);
  background: transparent;
}
.app-nav__tab:hover {
  color: var(--color-text);
  border-color: var(--color-primary);
  background: var(--color-primary-glow);
}
.app-nav__tab.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}


/* Móvil: ocultar tabs, más espacio al hamburguesa */
@media (max-width: 380px) {
  .app-nav__right { display: none; }
  .app-nav__left { width: auto; }
}

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
