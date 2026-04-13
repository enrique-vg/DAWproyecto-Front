/**
 * useToast — composable que expone métodos cortos para lanzar toasts.
 *
 * Ejemplo:
 *   const toast = useToast()
 *   toast.success('¡Guardado!')
 *   toast.error('Algo salió mal')
 *   toast.info('Ten en cuenta que...')
 *   toast.warning('Cuidado con...')
 */
import { useToastStore } from '@/stores/toastStore'

export function useToast() {
  const store = useToastStore()

  return {
    success: (msg, dur)  => store.add(msg, 'success', dur),
    error:   (msg, dur)  => store.add(msg, 'error',   dur ?? 4000),
    info:    (msg, dur)  => store.add(msg, 'info',    dur),
    warning: (msg, dur)  => store.add(msg, 'warning', dur)
  }
}
