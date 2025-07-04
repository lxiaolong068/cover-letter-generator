#!/usr/bin/env tsx

import { neon } from '@neondatabase/serverless';

// Use unpooled connection for migrations
const DATABASE_URL = process.env.NEON_DATABASE_URL_UNPOOLED || process.env.NEON_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('NEON_DATABASE_URL or NEON_DATABASE_URL_UNPOOLED environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Migration scripts
const migrations = [
  {
    id: '001_create_users_table',
    description: 'Create users table',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `,
  },
  {
    id: '002_create_user_sessions_table',
    description: 'Create user sessions table',
    sql: `
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
    `,
  },
  {
    id: '003_create_cover_letters_table',
    description: 'Create cover letters table',
    sql: `
      CREATE TYPE cover_letter_type AS ENUM ('professional', 'creative', 'technical', 'executive');

      CREATE TABLE IF NOT EXISTS cover_letters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        job_description TEXT NOT NULL,
        user_profile TEXT NOT NULL,
        cover_letter_type cover_letter_type NOT NULL DEFAULT 'professional',
        model_used VARCHAR(100) NOT NULL,
        tokens_used INTEGER,
        generation_time INTEGER NOT NULL, -- in milliseconds
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
      CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON cover_letters(created_at);
      CREATE INDEX IF NOT EXISTS idx_cover_letters_type ON cover_letters(cover_letter_type);
    `,
  },
  {
    id: '004_create_migrations_table',
    description: 'Create migrations tracking table',
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        description TEXT NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    id: '005_create_updated_at_trigger',
    description: 'Create updated_at trigger function',
    sql: `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Apply trigger to users table
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

      -- Apply trigger to cover_letters table
      DROP TRIGGER IF EXISTS update_cover_letters_updated_at ON cover_letters;
      CREATE TRIGGER update_cover_letters_updated_at
        BEFORE UPDATE ON cover_letters
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `,
  },
];

async function checkMigrationExists(migrationId: string): Promise<boolean> {
  try {
    const [result] = await sql`
      SELECT 1 FROM migrations WHERE id = ${migrationId}
    `;
    return !!result;
  } catch {
    // If migrations table doesn't exist, no migrations have been run
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function recordMigration(migration: { id: string; description: string }): Promise<void> {
  await sql`
    INSERT INTO migrations (id, description)
    VALUES (${migration.id}, ${migration.description})
    ON CONFLICT (id) DO NOTHING
  `;
}

async function runMigrations(): Promise<void> {
  console.log('Starting database migrations...');

  for (const migration of migrations) {
    console.log(`Checking migration: ${migration.id} - ${migration.description}`);

    const exists = await checkMigrationExists(migration.id);
    if (exists) {
      console.log(`  ✓ Migration ${migration.id} already applied`);
      continue;
    }

    console.log(`  → Running migration ${migration.id}...`);
    try {
      // Execute the migration SQL
      await sql.transaction([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sql.unsafe(migration.sql) as any,
        sql`INSERT INTO migrations (id, description) VALUES (${migration.id}, ${migration.description}) ON CONFLICT (id) DO NOTHING`,
      ]);

      console.log(`  ✓ Migration ${migration.id} completed successfully`);
    } catch (error) {
      console.error(`  ✗ Migration ${migration.id} failed:`, error);
      throw error;
    }
  }

  console.log('All migrations completed successfully!');
}

async function rollbackMigration(migrationId: string): Promise<void> {
  console.log(`Rolling back migration: ${migrationId}`);

  // Note: This is a simple implementation. In production, you'd want
  // to store rollback scripts for each migration
  await sql`DELETE FROM migrations WHERE id = ${migrationId}`;

  console.log(`Migration ${migrationId} rolled back`);
}

async function listMigrations(): Promise<void> {
  console.log('Applied migrations:');

  try {
    const appliedMigrations = await sql`
      SELECT id, description, executed_at 
      FROM migrations 
      ORDER BY executed_at ASC
    `;

    if (appliedMigrations.length === 0) {
      console.log('  No migrations have been applied');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    appliedMigrations.forEach((migration: any) => {
      console.log(`  ✓ ${migration.id} - ${migration.description} (${migration.executed_at})`);
    });
  } catch {
    console.log('  No migrations table found');
  }
}

// CLI interface
async function main(): Promise<void> {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'up':
      case undefined:
        await runMigrations();
        break;
      case 'list':
        await listMigrations();
        break;
      case 'rollback':
        const migrationId = process.argv[3];
        if (!migrationId) {
          console.error('Please specify a migration ID to rollback');
          process.exit(1);
        }
        await rollbackMigration(migrationId);
        break;
      default:
        console.log('Usage:');
        console.log('  npm run migrate        # Run all pending migrations');
        console.log('  npm run migrate up     # Run all pending migrations');
        console.log('  npm run migrate list   # List applied migrations');
        console.log('  npm run migrate rollback <id>  # Rollback a specific migration');
        process.exit(1);
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
