import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black mb-4" style={{ color: '#C8102E' }}>404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-500 mb-8">
          Cette page n&apos;existe pas ou a été supprimée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl"
            style={{ backgroundColor: '#C8102E' }}
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
          <Link
            href="/annonces"
            className="flex items-center justify-center gap-2 text-gray-700 font-semibold px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            <Search className="w-4 h-4" />
            Voir les annonces
          </Link>
        </div>
      </div>
    </div>
  )
}