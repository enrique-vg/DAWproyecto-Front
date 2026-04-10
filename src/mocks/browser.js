// Inicialización de MSW para el navegador.
// Este archivo se importa solo en desarrollo (ver main.js).
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
