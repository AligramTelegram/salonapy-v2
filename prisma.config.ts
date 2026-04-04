import path from 'node:path'
import { loadEnvFile } from 'node:process'
import { defineConfig } from 'prisma/config'

// prisma.config.ts bypasses auto .env loading — load manually
try { loadEnvFile(path.resolve('.env')) } catch {}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
})
