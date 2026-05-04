'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function BoutonDeconnexion() {
  const router = useRouter()

  async function handleDeconnexion() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleDeconnexion}
      className="flex items-center gap-2 text-gray-600 font-medium px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Déconnexion
    </button>
  )
}