import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, Bed, Bath, Square, Sofa, Phone, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { LABELS_DUREE, COULEURS_DUREE } from '@/lib/types'

export default async function PageDetailAnnonce({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // ✅ Who is viewing?
  const {
    data: { user: viewer },
  } = await supabase.auth.getUser()
  const estConnecte = !!viewer

  const { data: annonce, error, status } = await supabase
    .from('listings')
    .select('*, categories(*), regions(*)')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    const code = error.code

    if (status === 401 || status === 403 || code === '42501') {
      return (
        <div className="max-w-3xl mx-auto px-4 py-14">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès restreint</h1>
            <p className="text-gray-500 mb-6">Connectez-vous pour voir les détails de cette annonce.</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/connexion?redirect=/annonces/${id}`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: '#C8102E' }}
              >
                Se connecter
              </Link>

              <Link
                href="/annonces"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Retour aux annonces
              </Link>
            </div>
          </div>
        </div>
      )
    }

    notFound()
  }

  if (!annonce) {
    notFound()
  }

  // ✅ Profile (try with email; if column doesn't exist, fallback safely)
  let profil: { nom_complet?: string | null; telephone?: string | null; email?: string | null } | null = null

  const profilTry = await supabase
    .from('profiles')
    .select('nom_complet, telephone, email')
    .eq('id', annonce.user_id)
    .maybeSingle()

  if (!profilTry.error) {
    profil = profilTry.data
  } else {
    const profilFallback = await supabase
      .from('profiles')
      .select('nom_complet, telephone')
      .eq('id', annonce.user_id)
      .maybeSingle()

    profil = profilFallback.data ?? null
  }

  const labelDuree = LABELS_DUREE[annonce.type_duree] ?? annonce.type_duree
  const couleurDuree = COULEURS_DUREE[annonce.type_duree] ?? 'bg-gray-100 text-gray-700'

  const caracteristiques = [
    { label: 'Chambres', valeur: `${annonce.chambres} chambre${annonce.chambres > 1 ? 's' : ''}`, icone: Bed },
    {
      label: 'Salles de bain',
      valeur: `${annonce.salles_bain} salle${annonce.salles_bain > 1 ? 's' : ''}`,
      icone: Bath,
    },
    ...(annonce.superficie ? [{ label: 'Superficie', valeur: `${annonce.superficie} m²`, icone: Square }] : []),
    ...(annonce.meuble ? [{ label: 'Meublé', valeur: 'Oui', icone: Sofa }] : []),
  ]

  const telephone = profil?.telephone ?? null
  const email = profil?.email ?? null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Retour */}
      <Link
        href="/annonces"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux annonces
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2">
          {/* Galerie photos */}
          <div className="rounded-2xl overflow-hidden bg-gray-100 h-72 md:h-96 mb-6 relative">
            {annonce.images?.[0] ? (
              <img src={annonce.images[0]} alt={annonce.titre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-7xl mb-3">🏠</div>
                  <p>Aucune photo disponible</p>
                </div>
              </div>
            )}
          </div>

          {/* Infos principales */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${couleurDuree}`}>
                {labelDuree}
              </span>

              {annonce.categories && (
                <span className="text-sm font-semibold px-4 py-1.5 rounded-full bg-gray-100 text-gray-600">
                  {annonce.categories.nom}
                </span>
              )}

              {annonce.meuble && (
                <span className="text-sm font-semibold px-4 py-1.5 rounded-full bg-amber-100 text-amber-700">
                  Meublé
                </span>
              )}
            </div>

            {/* Titre */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{annonce.titre}</h1>

            {/* Localisation */}
            <div className="flex items-center gap-1.5 text-gray-500 mb-6">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>
                {annonce.regions?.nom}
                {annonce.adresse && ` · ${annonce.adresse}`}
              </span>
            </div>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
              {caracteristiques.map((c) => {
                const Icone = c.icone
                return (
                  <div key={c.label} className="text-center">
                    <Icone className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <p className="font-semibold text-gray-800 text-sm">{c.valeur}</p>
                    <p className="text-xs text-gray-400">{c.label}</p>
                  </div>
                )
              })}
            </div>

            {/* Description */}
            {annonce.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{annonce.description}</p>
              </div>
            )}
          </div>

          {/* Points clés */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Points clés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                `${annonce.chambres} chambre${annonce.chambres > 1 ? 's' : ''}`,
                `${annonce.salles_bain} salle${annonce.salles_bain > 1 ? 's' : ''} de bain`,
                annonce.meuble ? 'Appartement meublé' : 'Non meublé',
                annonce.superficie ? `${annonce.superficie} m² de superficie` : null,
                `Location ${labelDuree.toLowerCase()}`,
                annonce.disponible ? 'Disponible maintenant' : 'Pas encore disponible',
              ]
                .filter(Boolean)
                .map((point) => (
                  <div key={String(point)} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    {point}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            {/* Prix */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-gray-900">{annonce.prix.toLocaleString('fr-TN')} TND</p>
                <p className="text-gray-400 text-sm mt-1">par mois</p>
              </div>

              {/* ✅ Contact (hidden unless logged in) */}
              <div className="flex flex-col gap-3">
                {/* PHONE */}
                {estConnecte ? (
                  telephone ? (
                    <a
                      href={`tel:+216${telephone.replace(/\s/g, '')}`}
                      className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90"
                      style={{ backgroundColor: '#C8102E' }}
                    >
                      <Phone className="w-4 h-4" />
                      +216 {telephone}
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 text-gray-500 font-semibold py-3.5 rounded-xl border border-gray-200 bg-gray-50">
                      <Phone className="w-4 h-4" />
                      Non renseigné
                    </div>
                  )
                ) : (
                  <Link
                    href={`/connexion?redirect=/annonces/${id}`}
                    className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#C8102E' }}
                  >
                    <Phone className="w-4 h-4" />
                    Afficher le numéro (connexion)
                  </Link>
                )}

                {/* EMAIL */}
                {estConnecte ? (
                  email ? (
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent(`Annonce TunisiaRent : ${annonce.titre}`)}`}
                      className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Envoyer un email
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 bg-gray-50">
                      <Mail className="w-4 h-4" />
                      Non renseigné
                    </div>
                  )
                ) : (
                  <Link
                    href={`/connexion?redirect=/annonces/${id}`}
                    className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Afficher l’email (connexion)
                  </Link>
                )}
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                Annonce publiée le{' '}
                {new Date(annonce.created_at).toLocaleDateString('fr-TN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Infos rapides */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Informations</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Région</span>
                  <span className="font-medium text-gray-700">{annonce.regions?.nom ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Catégorie</span>
                  <span className="font-medium text-gray-700">{annonce.categories?.nom ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="font-medium text-gray-700">{labelDuree}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Meublé</span>
                  <span className="font-medium text-gray-700">{annonce.meuble ? 'Oui' : 'Non'}</span>
                </div>
                {annonce.superficie && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Superficie</span>
                    <span className="font-medium text-gray-700">{annonce.superficie} m²</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}