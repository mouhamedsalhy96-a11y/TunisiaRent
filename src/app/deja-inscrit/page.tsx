'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, RefreshCw, Mail, ArrowLeft } from 'lucide-react'

export default function DejaInscritPage() {
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
      options: { emailRedirectTo: `${window.location.origin}/connexion` },
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
          <Link href="/inscription" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Retour inscription
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Compte déjà existant</h1>
          <p className="text-gray-500 text-sm mb-6">
            Un compte existe déjà pour :
            <br />
            <span className="font-semibold text-gray-800 break-all">{email || 'cet email'}</span>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 text-left">
              {error}
            </div>
          )}

          {sent && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Email de confirmation renvoyé.
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href={`/connexion?email=${encodeURIComponent(email)}&already=1`}
              className="w-full text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#C8102E' }}
            >
              Aller à la connexion
            </Link>

            <button
              onClick={resend}
              disabled={!email || loading}
              className="w-full inline-flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Renvoi...' : 'Renvoyer l’email de confirmation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}