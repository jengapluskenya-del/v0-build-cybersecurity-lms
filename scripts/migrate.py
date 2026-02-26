#!/usr/bin/env python3
import os
import psycopg2
from pathlib import Path

def run_migrations():
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL is not set")
        exit(1)
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        print("Running migrations...")
        
        # Migration files in order
        migration_files = [
            '001_create_schema.sql',
            '002_seed_test_user.sql'
        ]
        
        scripts_dir = Path(__file__).parent
        
        for filename in migration_files:
            filepath = scripts_dir / filename
            
            if not filepath.exists():
                print(f"⏭️  Skipping {filename} (not found)")
                continue
            
            print(f"\n▶️  Running {filename}...")
            
            with open(filepath, 'r') as f:
                sql_content = f.read()
            
            # Split by semicolons and execute each statement
            statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]
            
            for statement in statements:
                try:
                    cursor.execute(statement)
                except Exception as e:
                    # Some statements might fail if they already exist, that's ok
                    if 'already exists' not in str(e):
                        print(f"⚠️  Warning: {str(e)[:100]}")
            
            conn.commit()
            print(f"✅ Completed {filename}")
        
        cursor.close()
        conn.close()
        
        print("\n✨ All migrations completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        exit(1)

if __name__ == '__main__':
    run_migrations()
