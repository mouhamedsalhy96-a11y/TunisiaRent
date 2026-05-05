'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Home, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function PageConnexion() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const presetEmail = searchParams.get('email') ?? ''
  const already = searchParams.get('already') === '1'

  // ✅ Only store what the user types.
  // If user didn't type yet, we display presetEmail from URL.
  const [emailInput, setEmailInput] = useState('')
  const email = emailInput || presetEmail

  const [motDePasse, setMotDePasse] = useState('')
  const [afficherMdp, setAfficherMdp] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  async function handleConnexion(e: React.FormEvent) {
    e.preventDefault()
    setChargement(true)
    setErreur('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse })

    if (error) {
      const msg = (error.message || '').toLowerCase()

      // ✅ Email not confirmed -> send user to check-email page
      if (msg.includes('not confirmed') || msg.includes('email_not_confirmed')) {
        router.push(`/verifier-email?email=${encodeURIComponent(email)}`)
        router.refresh()
        return
      }

      setErreur('Email ou mot de passe incorrect.')
      setChargement(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#C8102E' }}>
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Tunisia<span style={{ color: '#C8102E' }}>Rent</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-1">Connexion</h1>
          <p className="text-gray-500 text-sm">Accédez à votre espace propriétaire</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {already && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-5">
              Un compte existe déjà avec cet email. Connectez-vous ci-dessous.
            </div>
          )}

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {erreur}
            </div>
          )}

          <form onSubmit={handleConnexion} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={afficherMdp ? 'text' : 'password'}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setAfficherMdp(!afficherMdp)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {afficherMdp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <Link href="/mot-de-passe-oublie" className="text-sm font-medium hover:underline" style={{ color: '#C8102E' }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="w-full text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ backgroundColor: '#C8102E' }}
            >
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link href="/inscription" className="font-semibold" style={{ color: '#C8102E' }}>
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}