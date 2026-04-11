/**
 * MSW Handlers — Día 2: auth + timer completo.
 * Todos los datos viven en memoria durante la sesión del navegador.
 */
import { http, HttpResponse } from 'msw'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Datos en memoria ───────────────────────────────────────────────────────
let usuarioMock = {
  id: 1, nombre: 'Tanker Demo',
  email: 'demo@pomotanks.com', esPremium: false
}

let configMock = { tiempoTrabajo: 25, tiempoDescanso: 5, tiempoDescansoLargo: 15 }

let materiasMock = [
  { id: 1, nombre: 'Matemáticas' },
  { id: 2, nombre: 'Historia' },
  { id: 3, nombre: 'Programación' }
]

let sesiones    = []
let sesionCount = 100

export const handlers = [

  // ── AUTH ────────────────────────────────────────────────────────────────
  http.get(`${BASE}/sanctum/csrf-cookie`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.post(`${BASE}/api/login`, async ({ request }) => {
    const body = await request.json()
    if (!body.email || !body.password)
      return HttpResponse.json({ message: 'Credenciales incorrectas.' }, { status: 422 })
    return HttpResponse.json({ user: usuarioMock })
  }),

  http.post(`${BASE}/api/register`, async ({ request }) => {
    const body = await request.json()
    if (!body.email || !body.password || !body.nombre)
      return HttpResponse.json({ message: 'Faltan campos.' }, { status: 422 })
    usuarioMock = { ...usuarioMock, nombre: body.nombre, email: body.email }
    return HttpResponse.json({ user: usuarioMock }, { status: 201 })
  }),

  http.post(`${BASE}/api/logout`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.get(`${BASE}/api/user`, () =>
    new HttpResponse(null, { status: 401 })
  ),

  // ── CONFIGURACIÓN ──────────────────────────────────────────────────────
  http.get(`${BASE}/api/configuracion`, () =>
    HttpResponse.json(configMock)
  ),

  http.put(`${BASE}/api/configuracion`, async ({ request }) => {
    const body  = await request.json()
    configMock  = { ...configMock, ...body }
    return HttpResponse.json(configMock)
  }),

  // ── MATERIAS ───────────────────────────────────────────────────────────
  http.get(`${BASE}/api/materias`, () =>
    HttpResponse.json(materiasMock)
  ),

  http.post(`${BASE}/api/materias`, async ({ request }) => {
    const body  = await request.json()
    const nueva = { id: Date.now(), nombre: body.nombre }
    materiasMock.push(nueva)
    return HttpResponse.json(nueva, { status: 201 })
  }),

  http.delete(`${BASE}/api/materias/:id`, ({ params }) => {
    materiasMock = materiasMock.filter(m => m.id !== Number(params.id))
    return new HttpResponse(null, { status: 204 })
  }),

  // ── SESIONES ───────────────────────────────────────────────────────────
  http.post(`${BASE}/api/sesiones`, async ({ request }) => {
    const body    = await request.json()
    sesionCount++
    const sesion  = {
      id:          sesionCount,
      fechaInicio: new Date().toISOString(),
      fechaFin:    null,
      materia_id:  body.materia_id,
      completado:  false,
      periodos:    []
    }
    sesiones.push(sesion)
    return HttpResponse.json(sesion, { status: 201 })
  }),

  http.patch(`${BASE}/api/sesiones/:id/finalizar`, async ({ params, request }) => {
    const body   = await request.json()
    const sesion = sesiones.find(s => s.id === Number(params.id))
    if (sesion) {
      sesion.fechaFin   = new Date().toISOString()
      sesion.completado = body.completado
    }
    return HttpResponse.json(sesion ?? {})
  }),

  // ── PERIODOS ───────────────────────────────────────────────────────────
  http.post(`${BASE}/api/sesiones/:id/periodos`, async ({ params, request }) => {
    const body   = await request.json()
    const periodo = { id: Date.now(), sesion_id: Number(params.id), ...body }
    const sesion  = sesiones.find(s => s.id === Number(params.id))
    if (sesion) sesion.periodos.push(periodo)
    return HttpResponse.json(periodo, { status: 201 })
  })
]
