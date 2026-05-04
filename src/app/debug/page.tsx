'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function debug() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setDebugInfo({ error: 'Not logged in' })
        return
      }

      // Check profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Check listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id, titre, images, user_id')
        .eq('user_id', user.id)
        .limit(1)

      setDebugInfo({
        userId: user.id,
        userEmail: user.email,
        profile: { data: profile, error: profileError },
        listings: { data: listings, error: listingsError }
      })
    }

    debug()
  }, [])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <pre className="bg-white p-4 rounded border overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}
