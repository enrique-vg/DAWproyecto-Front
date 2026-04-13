/**
 * MSW Handlers — Pack L1: auth + timer + stats + perfil.
 */
import { http, HttpResponse } from 'msw'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

const hitosMock = [
  { id: 1, descripcion: 'Primera sesión completada 🎯', fecha: new Date().toISOString() },
  { id: 2, descripcion: '5 pomodoros en un día 🔥',    fecha: new Date().toISOString() }
]

function generarProgreso(periodo) {
  const etiquetas = {
    dia:    ['00h','02h','04h','06h','08h','10h','12h','14h','16h','18h','20h','22h'],
    semana: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
    mes:    Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    año:    ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  }
  const labels = etiquetas[periodo] ?? etiquetas.semana
  return {
    totalSesiones: Math.floor(Math.random() * 40) + 3,
    totalTiempo:   Math.floor(Math.random() * 500) + 60,
    grafico: { labels, datos: labels.map(() => Math.floor(Math.random() * 120)) }
  }
}

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

  // ── PERFIL ─────────────────────────────────────────────────────────────
  http.patch(`${BASE}/api/user`, async ({ request }) => {
    const body  = await request.json()
    usuarioMock = { ...usuarioMock, ...body }
    return HttpResponse.json({ user: usuarioMock })
  }),

  // ── CONFIG ─────────────────────────────────────────────────────────────
  http.get(`${BASE}/api/configuracion`, () =>
    HttpResponse.json(configMock)
  ),
  http.put(`${BASE}/api/configuracion`, async ({ request }) => {
    configMock = { ...configMock, ...await request.json() }
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
    sesionCount++
    const sesion = {
      id: sesionCount, fechaInicio: new Date().toISOString(),
      fechaFin: null, materia_id: (await request.json()).materia_id,
      completado: false, periodos: []
    }
    sesiones.push(sesion)
    return HttpResponse.json(sesion, { status: 201 })
  }),
  http.patch(`${BASE}/api/sesiones/:id/finalizar`, async ({ params, request }) => {
    const body   = await request.json()
    const sesion = sesiones.find(s => s.id === Number(params.id))
    if (sesion) { sesion.fechaFin = new Date().toISOString(); sesion.completado = body.completado }
    return HttpResponse.json(sesion ?? {})
  }),
  http.post(`${BASE}/api/sesiones/:id/periodos`, async ({ params, request }) => {
    const body    = await request.json()
    const periodo = { id: Date.now(), sesion_id: Number(params.id), ...body }
    const sesion  = sesiones.find(s => s.id === Number(params.id))
    if (sesion) sesion.periodos.push(periodo)
    return HttpResponse.json(periodo, { status: 201 })
  }),

  // ── ESTADÍSTICAS ───────────────────────────────────────────────────────
  http.get(`${BASE}/api/progreso`, ({ request }) => {
    const url     = new URL(request.url)
    const periodo = url.searchParams.get('periodo') ?? 'semana'
    return HttpResponse.json(generarProgreso(periodo))
  }),
  http.get(`${BASE}/api/hitos`, () =>
    HttpResponse.json(hitosMock)
  )
]
