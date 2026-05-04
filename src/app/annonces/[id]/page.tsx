import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, Bed, Bath, Square, Sofa, Phone, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { LABELS_DUREE, COULEURS_DUREE } from '@/lib/types'

type ProfilSansEmail = {
  nom_complet: string | null
  telephone: string | null
}

type ProfilAvecEmail = ProfilSansEmail & {
  email: string | null
}

export default async function PageDetailAnnonce({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user: viewer },
  } = await supabase.auth.getUser()
  const estConnecte = !!viewer

  const { data: annonce, error } = await supabase
    .from('listings')
    .select('*, categories(*), regions(*)')
    .eq('id', id)
    .maybeSingle()

  if (error || !annonce) notFound()

  // ✅ Profil propriétaire (nom + téléphone + email si colonne existe)
  let telephone: string | null = null
  let email: string | null = null
  let nomProprietaire: string | null = null

  if (annonce.user_id) {
    // Try reading email column if it exists
    const profilTry = await supabase
      .from('profiles')
      .select('nom_complet, telephone, email')
      .eq('id', annonce.user_id)
      .maybeSingle()

    if (!profilTry.error && profilTry.data) {
      const profil = profilTry.data as ProfilAvecEmail
      telephone = profil.telephone ?? null
      nomProprietaire = profil.nom_complet ?? null
      email = profil.email ?? null
    } else {
      // Fallback if profiles.email does not exist (or select fails)
      const profilFallback = await supabase
        .from('profiles')
        .select('nom_complet, telephone')
        .eq('id', annonce.user_id)
        .maybeSingle()

      if (profilFallback.data) {
        const profil = profilFallback.data as ProfilSansEmail
        telephone = profil.telephone ?? null
        nomProprietaire = profil.nom_complet ?? null
      }
      email = null
    }
  }

  const labelDuree = LABELS_DUREE[annonce.type_duree] ?? annonce.type_duree
  const couleurDuree = COULEURS_DUREE[annonce.type_duree] ?? 'bg-gray-100 text-gray-700'

  const caracteristiques = [
    { label: 'Chambres', valeur: `${annonce.chambres} chambre${annonce.chambres > 1 ? 's' : ''}`, icone: Bed },
    { label: 'Salles de bain', valeur: `${annonce.salles_bain} salle${annonce.salles_bain > 1 ? 's' : ''}`, icone: Bath },
    ...(annonce.superficie ? [{ label: 'Superficie', valeur: `${annonce.superficie} m²`, icone: Square }] : []),
    ...(annonce.meuble ? [{ label: 'Meublé', valeur: 'Oui', icone: Sofa }] : []),
  ]

  const redirectTo = `/connexion?redirect=/annonces/${id}`

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
          <div className="rounded-2xl overflow-hidden bg-gray-100 mb-6">
            {annonce.images && annonce.images.length > 0 ? (
              <div className="grid gap-2">
                <img
                  src={annonce.images[0]}
                  alt={annonce.titre}
                  className="w-full h-80 object-cover"
                />

                {annonce.images.length > 1 && (
                  <div
                    className={`grid gap-2 ${
                      annonce.images.length === 2 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'
                    }`}
                  >
                    {annonce.images.slice(1).map((url: string, i: number) => (
                      <img
                        key={`${url}-${i}`}
                        src={url}
                        alt={`${annonce.titre} - photo ${i + 2}`}
                        className="w-full h-32 object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-72 flex items-center justify-center">
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
            {/* Prix + Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-gray-900">{annonce.prix.toLocaleString('fr-TN')} TND</p>
                <p className="text-gray-400 text-sm mt-1">par mois</p>
              </div>

              {nomProprietaire && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: '#C8102E' }}
                  >
                    {nomProprietaire.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Propriétaire</p>
                    <p className="text-sm font-semibold text-gray-800">{nomProprietaire}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {/* Téléphone */}
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
                    <div className="w-full flex items-center justify-center gap-2 text-gray-400 font-medium py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm">
                      <Phone className="w-4 h-4" />
                      Numéro non renseigné
                    </div>
                  )
                ) : (
                  <Link
                    href={redirectTo}
                    className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#C8102E' }}
                  >
                    <Phone className="w-4 h-4" />
                    Connexion pour voir le contact
                  </Link>
                )}

                {/* Email */}
                {estConnecte ? (
                  email ? (
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent('Annonce TunisiaRent : ' + annonce.titre)}`}
                      className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {email}
                    </a>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 text-gray-400 font-medium py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm">
                      <Mail className="w-4 h-4" />
                      Email non renseigné
                    </div>
                  )
                ) : (
                  <Link
                    href={redirectTo}
                    className="w-full flex items-center justify-center gap-2 font-medium py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Connexion pour contacter
                  </Link>
                )}
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                Publié le{' '}
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