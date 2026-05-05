import { createClient } from '@supabase/supabase-js'
import { PROFILE_SCHEMA_SQL } from '../src/lib/migrations.sql'

async function runMigrations() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Running migrations...')

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: PROFILE_SCHEMA_SQL })

    if (error) {
      console.error('Migration error:', error)
      return
    }

    console.log('Migrations completed successfully!')
  } catch (err) {
    console.error('Failed to run migrations:', err)
  }
}

runMigrations()