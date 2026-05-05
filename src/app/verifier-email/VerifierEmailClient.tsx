'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react'

export default function VerifierEmailClient() {
  const searchParams = useSearchParams()
  const email = useMemo(() => searchParams.get('email') ?? '', [searchParams])

  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function resend() {
    if (!email) return
    setLoading(true)
    setError('')
    setSent(false)

    const supabase = createClient()

    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/connexion`,
      },
    })

    if (resendError) {
      setError(resendError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
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

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h1>

          <p className="text-gray-500 text-sm mb-6">
            Nous avons envoyé un lien de confirmation à :
            <br />
            <span className="font-semibold text-gray-800 break-all">{email || 'votre adresse email'}</span>
          </p>

          <div className="text-left bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 text-sm text-gray-600">
            <ul className="list-disc pl-5 space-y-1">
              <li>Ouvrez votre boîte mail et cliquez sur le lien de confirmation.</li>
              <li>Si vous ne voyez rien, vérifiez le dossier spam / indésirables.</li>
              <li>Ensuite, revenez ici et connectez-vous.</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 text-left">
              {error}
            </div>
          )}

          {sent && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Email renvoyé avec succès.
              </div>
            </div>
          )}

          <button
            onClick={resend}
            disabled={loading || !email}
            className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#C8102E' }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Renvoi...' : 'Renvoyer l’email de confirmation'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà confirmé ?{' '}
            <Link href="/connexion" className="font-semibold" style={{ color: '#C8102E' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}