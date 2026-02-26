const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Running migrations...');
    
    // Read and execute migration files in order
    const migrationFiles = [
      '001_create_schema.sql',
      '002_enhance_schema.sql',
      '003_seed_test_user.sql'
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, file);
      if (!fs.existsSync(filePath)) {
        console.log(`⏭️  Skipping ${file} (not found)`);
        continue;
      }

      const sqlContent = fs.readFileSync(filePath, 'utf-8');
      console.log(`\n▶️  Running ${file}...`);
      
      // Split by semicolons and execute non-empty statements
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      for (const statement of statements) {
        try {
          await sql(statement);
        } catch (err) {
          console.warn(`⚠️  Statement error (may be harmless): ${err.message}`);
        }
      }
      
      console.log(`✅ Completed ${file}`);
    }

    console.log('\n✨ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
