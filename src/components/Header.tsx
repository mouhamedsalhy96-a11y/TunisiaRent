'use client'
import Link from 'next/link'
import { Home, Plus, Menu, X, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [utilisateur, setUtilisateur] = useState<unknown>(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUtilisateur(data.user)
      setChargement(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUtilisateur(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleDeconnexion() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUtilisateur(null)
    setMenuOuvert(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#C8102E' }}>
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Tunisia<span style={{ color: '#C8102E' }}>Rent</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/annonces" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Toutes les annonces
            </Link>
            <Link href="/annonces?duree=etudiant" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              🎓 Étudiants
            </Link>
            <Link href="/annonces?duree=court_terme" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Court terme
            </Link>
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-3">
            {!chargement && (
              <>
                {utilisateur ? (
                  // Connecté
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mon espace
                    </Link>
                    <button
                      onClick={handleDeconnexion}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                    <Link
                      href="/ajouter"
                      className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#C8102E' }}
                    >
                      <Plus className="w-4 h-4" />
                      Déposer une annonce
                    </Link>
                  </>
                ) : (
                  // Non connecté
                  <>
                    <Link
                      href="/connexion"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/inscription"
                      className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#C8102E' }}
                    >
                      S&apos;inscrire
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Menu mobile burger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOuvert(!menuOuvert)}
          >
            {menuOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {menuOuvert && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-2">
          <Link href="/annonces" className="text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
            Toutes les annonces
          </Link>
          <Link href="/annonces?duree=etudiant" className="text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
            🎓 Section Étudiants
          </Link>
          <Link href="/annonces?duree=court_terme" className="text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50" onClick={() => setMenuOuvert(false)}>
            Court terme
          </Link>

          <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-2">
            {!chargement && (
              <>
                {utilisateur ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50"
                      onClick={() => setMenuOuvert(false)}
                    >
                      <User className="w-4 h-4" />
                      Mon espace
                    </Link>
                    <Link
                      href="/ajouter"
                      className="flex items-center justify-center gap-2 text-white font-medium py-2.5 px-4 rounded-lg"
                      style={{ backgroundColor: '#C8102E' }}
                      onClick={() => setMenuOuvert(false)}
                    >
                      <Plus className="w-4 h-4" />
                      Déposer une annonce
                    </Link>
                    <button
                      onClick={handleDeconnexion}
                      className="flex items-center gap-2 text-gray-500 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/connexion"
                      className="text-gray-700 font-medium py-2.5 px-3 rounded-lg hover:bg-gray-50 border border-gray-200 text-center"
                      onClick={() => setMenuOuvert(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/inscription"
                      className="text-white font-medium py-2.5 px-3 rounded-lg text-center"
                      style={{ backgroundColor: '#C8102E' }}
                      onClick={() => setMenuOuvert(false)}
                    >
                      S&apos;inscrire
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}