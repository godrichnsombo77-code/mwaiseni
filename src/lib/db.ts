import { PrismaClient } from '@prisma/client'

// On Render (production), the filesystem is read-only except /tmp.
// Override DATABASE_URL at runtime if it still points to ./db/
function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL || 'file:/tmp/custom.db'
  // If the URL points to ./db/ (relative, read-only on Render), redirect to /tmp
  if (envUrl.includes('./db/') || envUrl.includes('file:./db')) {
    return 'file:/tmp/custom.db'
  }
  return envUrl
}

const databaseUrl = getDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
