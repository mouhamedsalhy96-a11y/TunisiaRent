import { createClient } from '@/lib/supabase/server'
import CarteAnnonce from '@/components/CarteAnnonce'
import { Listing, Region, Categorie } from '@/lib/types'
import { SlidersHorizontal, MapPin } from 'lucide-react'
import Link from 'next/link'

type SearchParams = {
  region?: string
  categorie?: string
  duree?: string
  recherche?: string
}

const regions = [
  { nom: 'Tunis', slug: 'tunis' },
  { nom: 'Ariana', slug: 'ariana' },
  { nom: 'Ben Arous', slug: 'ben-arous' },
  { nom: 'La Manouba', slug: 'la-manouba' },
  { nom: 'Bizerte', slug: 'bizerte' },
  { nom: 'Nabeul', slug: 'nabeul' },
  { nom: 'Zaghouan', slug: 'zaghouan' },
  { nom: 'Béja', slug: 'beja' },
  { nom: 'Jendouba', slug: 'jendouba' },
  { nom: 'Le Kef', slug: 'le-kef' },
  { nom: 'Siliana', slug: 'siliana' },
  { nom: 'Sousse', slug: 'sousse' },
  { nom: 'Monastir', slug: 'monastir' },
  { nom: 'Mahdia', slug: 'mahdia' },
  { nom: 'Sfax', slug: 'sfax' },
  { nom: 'Kairouan', slug: 'kairouan' },
  { nom: 'Kasserine', slug: 'kasserine' },
  { nom: 'Sidi Bouzid', slug: 'sidi-bouzid' },
  { nom: 'Gabès', slug: 'gabes' },
  { nom: 'Médenine', slug: 'medenine' },
  { nom: 'Tataouine', slug: 'tataouine' },
  { nom: 'Gafsa', slug: 'gafsa' },
  { nom: 'Tozeur', slug: 'tozeur' },
  { nom: 'Kébili', slug: 'kebili' },
]

const categories = [
  { nom: 'Appartements', slug: 'appartement' },
  { nom: 'Maisons', slug: 'maison' },
  { nom: 'Villas', slug: 'villa' },
  { nom: 'Chambres', slug: 'chambre' },
  { nom: 'Studios', slug: 'studio' },
]

const durees = [
  { nom: 'Tous', slug: '' },
  { nom: 'Long terme', slug: 'long_terme' },
  { nom: 'Court terme', slug: 'court_terme' },
  { nom: '🎓 Étudiants', slug: 'etudiant' },
]

export default async function PageAnnonces({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select('*, categories(*), regions(*)')
    .eq('disponible', true)
    .order('created_at', { ascending: false })

  if (params.duree) {
    query = query.eq('type_duree', params.duree)
  }

  if (params.region) {
    const { data: regionData } = await supabase
      .from('regions')
      .select('id')
      .eq('slug', params.region)
      .single()
    if (regionData) {
      query = query.eq('region_id', regionData.id)
    }
  }

  if (params.categorie) {
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.categorie)
      .single()
    if (catData) {
      query = query.eq('category_id', catData.id)
    }
  }

  if (params.recherche) {
    query = query.ilike('titre', `%${params.recherche}%`)
  }

  const { data: annonces, error } = await query

  const titreSection = params.duree === 'etudiant'
    ? '🎓 Logements Étudiants'
    : params.duree === 'court_terme'
    ? 'Locations Court Terme'
    : params.duree === 'long_terme'
    ? 'Locations Long Terme'
    : 'Toutes les annonces'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Titre */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{titreSection}</h1>
        <p className="text-gray-500 mt-1">
          {annonces?.length ?? 0} annonce{(annonces?.length ?? 0) !== 1 ? 's' : ''} trouvée{(annonces?.length ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filtres */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="font-semibold text-gray-800">Filtres</span>
            </div>

            {/* Filtre durée */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Durée</p>
              <div className="flex flex-col gap-1">
                {durees.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/annonces${d.slug ? `?duree=${d.slug}` : ''}`}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                      params.duree === d.slug || (!params.duree && !d.slug)
                        ? 'font-semibold text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={
                      params.duree === d.slug || (!params.duree && !d.slug)
                        ? { backgroundColor: '#C8102E' }
                        : {}
                    }
                  >
                    {d.nom}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filtre catégorie */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Catégorie</p>
              <div className="flex flex-col gap-1">
                <Link
                  href={`/annonces${params.duree ? `?duree=${params.duree}` : ''}`}
                  className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                    !params.categorie ? 'font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={!params.categorie ? { color: '#C8102E' } : {}}
                >
                  Toutes
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/annonces?categorie=${cat.slug}${params.duree ? `&duree=${params.duree}` : ''}`}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                      params.categorie === cat.slug
                        ? 'font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={params.categorie === cat.slug ? { color: '#C8102E' } : {}}
                  >
                    {cat.nom}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filtre région */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Région</p>
              <div className="flex flex-col gap-1">
                {regions.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/annonces?region=${r.slug}${params.duree ? `&duree=${params.duree}` : ''}`}
                    className={`text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      params.region === r.slug
                        ? 'font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={params.region === r.slug ? { color: '#C8102E' } : {}}
                  >
                    <MapPin className="w-3 h-3" />
                    {r.nom}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Grille d'annonces */}
        <div className="flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm mb-6">
              Erreur de chargement : {error.message}
            </div>
          )}

          {!annonces || annonces.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune annonce trouvée</h3>
              <p className="text-gray-400 mb-6">Essayez de modifier vos filtres de recherche</p>
              <Link
                href="/annonces"
                className="text-white font-medium px-6 py-3 rounded-xl"
                style={{ backgroundColor: '#C8102E' }}
              >
                Voir toutes les annonces
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {annonces.map((annonce) => (
                <CarteAnnonce key={annonce.id} annonce={annonce as Listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}