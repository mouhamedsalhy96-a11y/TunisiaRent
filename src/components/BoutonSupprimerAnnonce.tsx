'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function BoutonSupprimerAnnonce({ id }: { id: string }) {
  const router = useRouter()

  async function handleSupprimer() {
    const confirme = window.confirm('Supprimer cette annonce définitivement ?')
    if (!confirme) return

    const supabase = createClient()
    await supabase.from('listings').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleSupprimer}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="Supprimer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}