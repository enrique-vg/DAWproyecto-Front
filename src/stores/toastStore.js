/**
 * toastStore — gestiona la cola de notificaciones toast.
 *
 * Tipos: 'success' | 'error' | 'info' | 'warning'
 *
 * Uso desde cualquier componente o store:
 *   import { useToast } from '@/composables/useToast'
 *   const toast = useToast()
 *   toast.success('Guardado correctamente')
 *   toast.error('Ha ocurrido un error')
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let counter  = 0

  function add(mensaje, tipo = 'info', duracion = 3000) {
    const id = ++counter
    toasts.value.push({ id, mensaje, tipo })
    setTimeout(() => remove(id), duracion)
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, add, remove }
})
