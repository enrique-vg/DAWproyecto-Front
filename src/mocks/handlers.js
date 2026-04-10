/**
 * MSW Handlers — Día 1: solo endpoints de autenticación.
 *
 * Estos handlers interceptan las peticiones HTTP en desarrollo
 * y devuelven respuestas simuladas, sin necesidad de backend real.
 *
 * En el Pack Día 2 se añadirán los handlers del timer y las materias.
 */
import { http, HttpResponse } from 'msw'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Usuario simulado en memoria (se actualiza con register)
let usuarioMock = {
  id: 1,
  nombre: 'Tanker Demo',
  email: 'demo@pomotanks.com',
  esPremium: false
}

export const handlers = [
  // Sanctum: cookie CSRF (necesario antes de login/register)
  http.get(`${BASE}/sanctum/csrf-cookie`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // POST /api/login
  http.post(`${BASE}/api/login`, async ({ request }) => {
    const body = await request.json()

    // Validación mínima: solo comprobamos que vengan email y password
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Las credenciales son incorrectas.' },
        { status: 422 }
      )
    }

    // En mock aceptamos cualquier email/password válidos
    return HttpResponse.json({ user: usuarioMock })
  }),

  // POST /api/register
  http.post(`${BASE}/api/register`, async ({ request }) => {
    const body = await request.json()

    if (!body.email || !body.password || !body.nombre) {
      return HttpResponse.json(
        { message: 'Faltan campos obligatorios.' },
        { status: 422 }
      )
    }

    // Actualizamos el usuario mock con los datos del registro
    usuarioMock = {
      ...usuarioMock,
      nombre: body.nombre,
      email: body.email
    }

    return HttpResponse.json({ user: usuarioMock }, { status: 201 })
  }),

  // POST /api/logout
  http.post(`${BASE}/api/logout`, () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // GET /api/user — devuelve 401 para simular sesión no activa al recargar
  // (así el guard del router funciona correctamente en desarrollo)
  http.get(`${BASE}/api/user`, () => {
    // Cambia esto a `return HttpResponse.json(usuarioMock)`
    // si quieres que recargando la página mantenga la sesión en mock
    return new HttpResponse(null, { status: 401 })
  })
]
