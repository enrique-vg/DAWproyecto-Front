<template>
  <AuthLayout>
    <h2 class="auth-title">Crear cuenta nueva</h2>

    <form class="auth-form" @submit.prevent="handleRegister" novalidate>
      <!-- Nombre -->
      <div class="field">
        <label for="reg-nombre" class="field__label">Nombre</label>
        <InputText
          id="reg-nombre"
          v-model="form.nombre"
          placeholder="Tu nombre"
          autocomplete="name"
          :class="{ 'p-invalid': errors.nombre }"
        />
        <small v-if="errors.nombre" class="field__error">{{ errors.nombre }}</small>
      </div>

      <!-- Email -->
      <div class="field">
        <label for="reg-email" class="field__label">Correo electrónico</label>
        <InputText
          id="reg-email"
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
        <label for="reg-password" class="field__label">Contraseña</label>
        <Password
          id="reg-password"
          v-model="form.password"
          placeholder="Mínimo 8 caracteres"
          :feedback="true"
          toggleMask
          autocomplete="new-password"
          :class="{ 'p-invalid': errors.password }"
        />
        <small v-if="errors.password" class="field__error">{{ errors.password }}</small>
      </div>

      <!-- Confirmar contraseña -->
      <div class="field">
        <label for="reg-confirm" class="field__label">Confirmar contraseña</label>
        <Password
          id="reg-confirm"
          v-model="form.passwordConfirm"
          placeholder="Repite la contraseña"
          :feedback="false"
          toggleMask
          autocomplete="new-password"
          :class="{ 'p-invalid': errors.passwordConfirm }"
        />
        <small v-if="errors.passwordConfirm" class="field__error">{{ errors.passwordConfirm }}</small>
      </div>

      <!-- Error global -->
      <div v-if="authStore.error" class="auth-error" role="alert">
        {{ authStore.error }}
      </div>

      <!-- Submit -->
      <button type="submit" class="btn btn--primary btn--lg" :disabled="authStore.loading">
        <i v-if="authStore.loading" class="pi pi-spin pi-spinner" style="margin-right:0.5rem"></i>
        {{ authStore.loading ? 'Registrando...' : 'Crear cuenta' }}
      </button>
    </form>

    <div class="auth-divider"><span>¿Ya tienes cuenta?</span></div>

    <RouterLink to="/login" class="btn btn--ghost btn--lg">
      Iniciar sesión
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

const form = reactive({
  nombre: '', email: '', password: '', passwordConfirm: ''
})
const errors = reactive({
  nombre: '', email: '', password: '', passwordConfirm: ''
})

function validate() {
  Object.keys(errors).forEach(k => (errors[k] = ''))
  if (!form.nombre.trim())              errors.nombre          = 'El nombre es obligatorio'
  if (!form.email)                      errors.email           = 'El correo es obligatorio'
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email     = 'Formato de correo no válido'
  if (!form.password)                   errors.password        = 'La contraseña es obligatoria'
  else if (form.password.length < 8)    errors.password        = 'Mínimo 8 caracteres'
  if (form.password !== form.passwordConfirm) errors.passwordConfirm = 'Las contraseñas no coinciden'
  return Object.values(errors).every(e => !e)
}

async function handleRegister() {
  if (!validate()) return
  const ok = await authStore.register({
    nombre: form.nombre,
    email: form.email,
    password: form.password,
    password_confirmation: form.passwordConfirm
  })
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
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.03em;
}
.field__error { color: var(--color-danger); font-size: 0.8rem; }
.auth-error {
  background: rgba(255,94,94,0.1);
  border: 1px solid rgba(255,94,94,0.3);
  border-radius: var(--radius-sm);
  color: var(--color-danger);
  font-size: 0.85rem;
  padding: 0.6rem 0.9rem;
}
.auth-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 0 0.75rem;
}
.auth-divider::before,
.auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
.auth-divider span { font-size: 0.8rem; color: var(--color-text-dim); white-space: nowrap; }
</style>
