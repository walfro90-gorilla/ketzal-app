#!/usr/bin/env node
/**
 * Credential expiry checker.
 *
 * Reads config/secrets-expiry.json (metadata only — never secret values) and
 * reports how many days remain before each tracked credential expires.
 *
 *   npm run check:secrets
 *
 * Exit code 1 if any secret is expired or within the warning window, so it can
 * gate CI or a pre-dev hook. Purely local; reads no secret material.
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const WARN_DAYS = 7

const here = dirname(fileURLToPath(import.meta.url))
const configPath = join(here, "..", "config", "secrets-expiry.json")

let data
try {
  data = JSON.parse(readFileSync(configPath, "utf8"))
} catch (err) {
  console.error(`No pude leer ${configPath}: ${err.message}`)
  process.exit(1)
}

const today = new Date()
today.setHours(0, 0, 0, 0)
const MS_PER_DAY = 1000 * 60 * 60 * 24

let problems = 0

console.log("🔐 Estado de credenciales rastreadas:\n")

for (const s of data.secrets ?? []) {
  const expires = new Date(s.expiresAt)
  expires.setHours(0, 0, 0, 0)
  const days = Math.round((expires - today) / MS_PER_DAY)

  let icon = "✅"
  let status = `expira en ${days} días (${s.expiresAt})`
  if (days < 0) {
    icon = "⛔"
    status = `EXPIRÓ hace ${Math.abs(days)} días (${s.expiresAt})`
    problems++
  } else if (days <= WARN_DAYS) {
    icon = "⚠️ "
    status = `expira en ${days} días (${s.expiresAt}) — ROTAR YA`
    problems++
  }

  console.log(`${icon} ${s.name}`)
  console.log(`     ${status}`)
  if (s.rotateAt) console.log(`     rotar en: ${s.rotateAt}`)
  if (s.note) console.log(`     nota: ${s.note}`)
  console.log("")
}

if (problems > 0) {
  console.log(`${problems} credencial(es) requieren atención.`)
  process.exit(1)
}
console.log("Todo en orden.")
