'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { REGIONS } from '@/lib/regions'

export default function BarreRecherche() {
  const router = useRouter()
  const [recherche, setRecherche] = useState('')
  const [region, setRegion] = useState('')

  function handleRecherche(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (recherche.trim()) params.set('recherche', recherche.trim())
    if (region) params.set('region', region)
    router.push(`/annonces${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <form
      onSubmit={handleRecherche}
      className="max-w-3xl mx-auto bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-2xl"
    >
      <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="Rechercher (appartement, villa...)"
          className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
        />
      </div>
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 md:w-52">
        <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="flex-1 outline-none text-gray-700 text-sm bg-transparent"
        >
          <option value="">Toutes régions</option>
          {REGIONS.map(r => (
            <option key={r.slug} value={r.slug}>{r.nom}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 text-white font-semibold px-8 py-3 rounded-xl transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#C8102E' }}
      >
        <Search className="w-4 h-4" />
        Rechercher
      </button>
    </form>
  )
}