#!/usr/bin/env node
/**
 * Smoke test de conectividad Supabase (schema ketzal) con la anon key.
 *
 *   node scripts/supabase-smoke.mjs
 *
 * Usa el REST endpoint (PostgREST) directamente con fetch para evitar el
 * cliente realtime de supabase-js (que en Node < 22 exige WebSocket nativo).
 * Esto prueba el cableado real que importa: anon key + schema `ketzal` expuesto
 * + RLS. No escribe nada.
 *
 * Verifica:
 *  1. GET ketzal.services (RLS lectura pública) → 200, 0+ filas.
 *  2. GET ketzal.profiles como anon → 401 permission denied (anon no tiene grant;
 *     defensa en profundidad antes incluso de RLS).
 */
import { readFileSync } from "node:fs"

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !anon) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY")
  process.exit(1)
}

const headers = {
  apikey: anon,
  Authorization: `Bearer ${anon}`,
  "Accept-Profile": "ketzal", // selecciona el schema ketzal en PostgREST
}

let fail = 0

async function getRows(table) {
  const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, { headers })
  const body = await res.json()
  return { status: res.status, body }
}

const services = await getRows("services")
if (services.status === 200 && Array.isArray(services.body)) {
  console.log(`✅ ketzal.services legible (anon). filas: ${services.body.length}`)
} else {
  console.error(`❌ ketzal.services status=${services.status}:`, JSON.stringify(services.body))
  fail++
}

const profiles = await getRows("profiles")
if (profiles.status === 401 || profiles.status === 403) {
  console.log(`✅ ketzal.profiles bloqueado para anon (status ${profiles.status}, sin grant — correcto)`)
} else if (profiles.status === 200 && Array.isArray(profiles.body) && profiles.body.length === 0) {
  console.log("✅ ketzal.profiles devuelve [] para anon (RLS OK)")
} else {
  console.error(`❌ ketzal.profiles inesperado status=${profiles.status}:`, JSON.stringify(profiles.body))
  fail++
}

if (fail) {
  console.error(`\n${fail} verificación(es) fallaron.`)
  process.exit(1)
}
console.log("\nSmoke test OK: anon + schema ketzal expuesto + RLS funcionando.")
