import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Eye } from 'lucide-react'
import { LABELS_DUREE, COULEURS_DUREE } from '@/lib/types'
import BoutonSupprimerAnnonce from '@/components/BoutonSupprimerAnnonce'

export default async function PageDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const { data: annonces } = await supabase
    .from('listings')
    .select('*, categories(*), regions(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const nomUtilisateur = user.user_metadata?.nom_complet ?? user.email

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon espace</h1>
          <p className="text-gray-500 text-sm mt-1">Bienvenue, {nomUtilisateur}</p>
        </div>

        {/* Buttons removed (already in Header) */}
        <div className="flex items-center gap-3" />
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total annonces', valeur: annonces?.length ?? 0 },
          { label: 'Actives', valeur: annonces?.filter(a => a.disponible).length ?? 0 },
          { label: 'Long terme', valeur: annonces?.filter(a => a.type_duree === 'long_terme').length ?? 0 },
          { label: 'Court terme', valeur: annonces?.filter(a => a.type_duree === 'court_terme').length ?? 0 },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <p className="text-3xl font-bold text-gray-900">{stat.valeur}</p>
            <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Liste des annonces */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Mes annonces</h2>
        </div>

        {!annonces || annonces.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏠</div>
            <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore d&apos;annonces</p>
            <Link
              href="/ajouter"
              className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-xl"
              style={{ backgroundColor: '#C8102E' }}
            >
              <Plus className="w-4 h-4" />
              Déposer ma première annonce
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {annonces.map(annonce => (
              <div key={annonce.id} className="px-6 py-4 flex items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        COULEURS_DUREE[annonce.type_duree]
                      }`}
                    >
                      {LABELS_DUREE[annonce.type_duree]}
                    </span>
                    {annonce.categories && (
                      <span className="text-xs text-gray-400">{annonce.categories.nom}</span>
                    )}
                  </div>

                  <p className="font-medium text-gray-800 text-sm truncate">{annonce.titre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {annonce.regions?.nom} · {annonce.prix.toLocaleString('fr-TN')} TND/mois
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/annonces/${annonce.id}`}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <BoutonSupprimerAnnonce id={annonce.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}