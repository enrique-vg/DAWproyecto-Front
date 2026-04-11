<template>
  <nav class="app-nav">

    <!-- Izquierda: menú hamburguesa -->
    <div class="app-nav__left">
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
        <div
          v-if="menuOpen"
          class="app-nav__dropdown"
          v-click-outside="() => menuOpen = false"
        >
          <RouterLink
            to="/timer"
            class="app-nav__dropdown-item"
            @click="menuOpen = false"
          >
            <i class="pi pi-clock"></i> Timer
          </RouterLink>
          <RouterLink
            to="/stats"
            class="app-nav__dropdown-item"
            @click="menuOpen = false"
          >
            <i class="pi pi-chart-bar"></i> Estadísticas
          </RouterLink>
          <div class="app-nav__divider"></div>
          <button
            class="app-nav__dropdown-item app-nav__dropdown-item--danger"
            @click="handleLogout"
          >
            <i class="pi pi-sign-out"></i> Cerrar sesión
          </button>
        </div>
      </Transition>
    </div>

    <!-- Centro: marca -->
    <RouterLink to="/timer" class="app-nav__brand">PomoTanks</RouterLink>

    <!-- Derecha: tabs -->
    <div class="app-nav__right">
      <RouterLink
        to="/timer"
        class="app-nav__tab"
        :class="{ active: $route.name === 'timer' }"
      >
        Timer
      </RouterLink>
      <RouterLink
        to="/stats"
        class="app-nav__tab"
        :class="{ active: $route.name === 'stats' }"
      >
        Stats
      </RouterLink>
    </div>

  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router    = useRouter()
const authStore = useAuthStore()
const menuOpen  = ref(false)

async function handleLogout() {
  menuOpen.value = false
  await authStore.logout()
  router.push({ name: 'welcome' })
}

// Directiva personalizada: cierra el dropdown al hacer click fuera
const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._handler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._handler)
  }
}
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
  background: rgba(14,14,19,0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-soft);
}

/* ── Izquierda ── */
.app-nav__left { position: relative; width: 80px; }

.app-nav__menu-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 20px;
}
.hamburger span {
  display: block;
  height: 2px;
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
  min-width: 180px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  z-index: 200;
}
.app-nav__dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  font-family: var(--font-display);
  font-weight: 500;
  text-decoration: none !important;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.app-nav__dropdown-item:hover { background: var(--color-surface-2); color: var(--color-text); }
.app-nav__dropdown-item.router-link-active { color: var(--color-primary); }
.app-nav__dropdown-item--danger { color: var(--color-danger) !important; }
.app-nav__dropdown-item--danger:hover { background: rgba(255,94,94,0.08) !important; }
.app-nav__divider { height: 1px; background: var(--color-border-soft); margin: 0.2rem 0; }

/* ── Centro ── */
.app-nav__brand {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--color-text);
  text-decoration: none !important;
  letter-spacing: -0.01em;
}

/* ── Derecha ── */
.app-nav__right { display: flex; gap: 0.25rem; width: 80px; justify-content: flex-end; }

.app-nav__tab {
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-decoration: none !important;
  transition: all 0.2s;
}
.app-nav__tab:hover { color: var(--color-text); background: var(--color-surface-2); }
.app-nav__tab.active { background: var(--color-primary); color: #fff; }

/* Animación dropdown */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
