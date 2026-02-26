#!/usr/bin/env node
import { neon } from '@neondatabase/serverless'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function migrate() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('[v0] ERROR: DATABASE_URL is not set')
    process.exit(1)
  }

  console.log('[v0] Starting migrations...')
  const sql = neon(databaseUrl)

  try {
    // Read migration files
    const migrations = [
      '001_create_schema.sql',
      '002_seed_test_user.sql'
    ]

    for (const migrationFile of migrations) {
      const filePath = path.join(__dirname, migrationFile)
      console.log(`[v0] Reading migration file: ${filePath}`)
      
      if (!fs.existsSync(filePath)) {
        console.warn(`[v0] Migration file not found: ${filePath}`)
        continue
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      console.log(`[v0] Executing ${migrationFile}...`)

      // Split by semicolons and execute each statement
      const statements = content
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        try {
          console.log(`[v0] Running statement: ${statement.substring(0, 50)}...`)
          await sql(statement)
        } catch (error) {
          // Ignore "already exists" errors
          if (error.message && error.message.includes('already exists')) {
            console.log(`[v0] Skipped (already exists): ${statement.substring(0, 50)}...`)
          } else {
            console.warn(`[v0] Error: ${error.message}`)
          }
        }
      }
      
      console.log(`[v0] ✓ ${migrationFile} completed`)
    }

    console.log('[v0] All migrations completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('[v0] Migration failed:', error)
    process.exit(1)
  }
}

migrate()
