import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import 'primeicons/primeicons.css'

import router from './router'
import App from './App.vue'
import '@/assets/css/main.css'

async function bootstrap() {
  // MSW solo en desarrollo — intercepta las peticiones API con datos mock
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' }
    })
  }

  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(PrimeVue, { ripple: true })

  // Componentes PrimeVue usados en formularios de auth
  app.component('InputText', InputText)
  app.component('Password', Password)
  app.component('Dropdown', Dropdown)

  app.mount('#app')
}

bootstrap()
