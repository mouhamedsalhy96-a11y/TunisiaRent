'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function MotDePasseOublie() {
  const [email, setEmail] = useState('')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState(false)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setChargement(true)
    setErreur('')

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/reinitialiser-mot-de-passe`

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
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
        <div className="mb-6">
          <Link href="/connexion" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Retour connexion
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
          <p className="text-gray-500 text-sm mb-6">Recevez un lien par email pour réinitialiser votre mot de passe.</p>

          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {erreur}
            </div>
          )}

          {succes ? (
            <div className="text-center">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-gray-900 mb-1">Email envoyé</p>
              <p className="text-gray-500 text-sm">
                Vérifiez votre boîte email et cliquez sur le lien pour choisir un nouveau mot de passe.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={chargement}
                className="w-full text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#C8102E' }}
              >
                {chargement ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
