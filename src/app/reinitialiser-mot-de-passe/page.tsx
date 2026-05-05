'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ReinitialiserMotDePasse() {
  const [motDePasse, setMotDePasse] = useState('')
  const [afficher, setAfficher] = useState(false)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // When user arrives via reset link, Supabase sets a recovery session.
    // We'll just check user exists.
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setReady(!!data.user)
    })
  }, [])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setChargement(true)
    setErreur('')

    if (motDePasse.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères.')
      setChargement(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: motDePasse })

    if (error) {
      setErreur(error.message)
      setChargement(false)
      return
    }

    setSucces(true)
    setChargement(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-500 text-sm mb-6">Choisissez un nouveau mot de passe pour votre compte.</p>

          {!ready && !succes && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3 mb-5">
              Lien invalide ou expiré. Veuillez refaire une demande de réinitialisation.
              <div className="mt-2">
                <Link href="/mot-de-passe-oublie" className="font-semibold underline">
                  Refaire la demande
                </Link>
              </div>
            </div>
          )}

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {erreur}
            </div>
          )}

          {succes ? (
            <div className="text-center">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Mot de passe mis à jour</p>
              <p className="text-gray-500 text-sm mb-5">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              <Link
                href="/connexion"
                className="inline-block text-white font-semibold px-8 py-3 rounded-xl"
                style={{ backgroundColor: '#C8102E' }}
              >
                Se connecter
              </Link>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={afficher ? 'text' : 'password'}
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    required
                    placeholder="Minimum 6 caractères"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setAfficher(!afficher)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {afficher ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={chargement || !ready}
                className="w-full text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#C8102E' }}
              >
                {chargement ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}