<template>
  <!-- Loader hasta que la sesión esté verificada -->
  <Transition name="loader-fade">
    <AppLoader v-if="!authStore.initialized" />
  </Transition>

  <!-- App normal -->
  <Transition name="loader-fade">
    <div v-if="authStore.initialized" class="app-root">
      <RouterView v-slot="{ Component, route }">
        <Transition :name="route.meta.transition || 'fade'" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>
  </Transition>

  <!-- Toast global -->
  <ToastNotification />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppLoader         from '@/components/ui/AppLoader.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import { useAuthStore }  from '@/stores/authStore'

const authStore = useAuthStore()

// Verifica la sesión al arrancar antes de mostrar nada
onMounted(async () => {
  await authStore.fetchUser()
})
</script>

<style>
.app-root { min-height: 100vh; }

/* Transición del loader */
.loader-fade-enter-active { transition: opacity 0.3s ease; }
.loader-fade-leave-active  { transition: opacity 0.4s ease 0.1s; }
.loader-fade-enter-from,
.loader-fade-leave-to      { opacity: 0; }

/* Transiciones de página */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
