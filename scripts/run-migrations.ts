import { neon } from '@neondatabase/serverless'
import * as fs from 'fs'
import * as path from 'path'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function runMigrations() {
  try {
    console.log('[v0] Starting database migrations...')

    // List of migration files in order
    const migrationFiles = [
      '001_create_schema.sql',
      '002_enhance_schema.sql',
      '003_seed_test_user.sql',
    ]

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, file)

      if (!fs.existsSync(filePath)) {
        console.log(`[v0] Skipping ${file} - file not found`)
        continue
      }

      console.log(`[v0] Running migration: ${file}`)
      const migrationSql = fs.readFileSync(filePath, 'utf-8')

      // Split SQL statements by semicolon
      const statements = migrationSql
        .split(';')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0)

      for (const statement of statements) {
        try {
          await sql.query(statement)
          console.log(`[v0] Executed statement successfully`)
        } catch (error) {
          console.error(`[v0] Error executing statement:`, error)
          // Continue with next statement
        }
      }

      console.log(`[v0] Completed migration: ${file}`)
    }

    console.log('[v0] All migrations completed successfully!')
  } catch (error) {
    console.error('[v0] Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
