<template>
  <AuthLayout>
    <h2 class="auth-title">Iniciar sesión</h2>

    <form class="auth-form" @submit.prevent="handleLogin" novalidate>
      <!-- Email -->
      <div class="field">
        <label for="login-email" class="field__label">Móvil o correo electrónico</label>
        <InputText
          id="login-email"
          v-model="form.email"
          type="email"
          placeholder="tu@correo.com"
          autocomplete="email"
          :class="{ 'p-invalid': errors.email }"
        />
        <small v-if="errors.email" class="field__error">{{ errors.email }}</small>
      </div>

      <!-- Contraseña -->
      <div class="field">
        <label for="login-password" class="field__label">Contraseña</label>
        <Password
          id="login-password"
          v-model="form.password"
          placeholder="••••••••"
          :feedback="false"
          toggleMask
          autocomplete="current-password"
          :class="{ 'p-invalid': errors.password }"
        />
        <small v-if="errors.password" class="field__error">{{ errors.password }}</small>
      </div>

      <!-- Error global de la API -->
      <div v-if="authStore.error" class="auth-error" role="alert">
        {{ authStore.error }}
      </div>

      <!-- Submit -->
      <button type="submit" class="btn btn--primary btn--lg" :disabled="authStore.loading">
        <i v-if="authStore.loading" class="pi pi-spin pi-spinner" style="margin-right:0.5rem"></i>
        {{ authStore.loading ? 'Entrando...' : 'Iniciar sesión' }}
      </button>

      <a href="#" class="auth-link">¿Has olvidado la contraseña?</a>
    </form>

    <div class="auth-divider"><span>¿No tienes cuenta?</span></div>

    <RouterLink to="/register" class="btn btn--ghost btn--lg">
      Crear cuenta nueva
    </RouterLink>
  </AuthLayout>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import AuthLayout from '@/components/auth/AuthLayout.vue'

const router    = useRouter()
const authStore = useAuthStore()

const form   = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

function validate() {
  errors.email    = ''
  errors.password = ''
  if (!form.email)                        errors.email    = 'El correo es obligatorio'
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Formato de correo no válido'
  if (!form.password)                     errors.password = 'La contraseña es obligatoria'
  return !errors.email && !errors.password
}

async function handleLogin() {
  if (!validate()) return
  const ok = await authStore.login({ email: form.email, password: form.password })
  if (ok) router.push({ name: 'timer' })
}
</script>

<style scoped>
.auth-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1.75rem;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.03em;
}

.field__error {
  color: var(--color-danger);
  font-size: 0.8rem;
}

.auth-error {
  background: rgba(255,94,94,0.1);
  border: 1px solid rgba(255,94,94,0.3);
  border-radius: var(--radius-sm);
  color: var(--color-danger);
  font-size: 0.85rem;
  padding: 0.6rem 0.9rem;
}

.auth-link {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
  display: block;
}
.auth-link:hover {
  color: var(--color-primary);
  text-decoration: none;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 0 0.75rem;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}
.auth-divider span {
  font-size: 0.8rem;
  color: var(--color-text-dim);
  white-space: nowrap;
}
</style>
