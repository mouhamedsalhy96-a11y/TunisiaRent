import Link from 'next/link'
import { Building, Castle, Bed, GraduationCap, Clock, Calendar, Home, MapPin } from 'lucide-react'
import BarreRecherche from '@/components/BarreRecherche'

const categories = [
  { nom: 'Appartements', slug: 'appartement', icone: Building, couleur: 'bg-blue-50 text-blue-600' },
  { nom: 'Maisons', slug: 'maison', icone: Home, couleur: 'bg-green-50 text-green-600' },
  { nom: 'Villas', slug: 'villa', icone: Castle, couleur: 'bg-purple-50 text-purple-600' },
  { nom: 'Chambres', slug: 'chambre', icone: Bed, couleur: 'bg-orange-50 text-orange-600' },
]

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

const typesLocation = [
  {
    titre: 'Long terme',
    description: 'Location de plusieurs mois à années',
    icone: Calendar,
    lien: '/annonces?duree=long_terme',
    couleur: 'bg-blue-600',
  },
  {
    titre: 'Court terme',
    description: 'Vacances, déplacements, séjours courts',
    icone: Clock,
    lien: '/annonces?duree=court_terme',
    couleur: 'bg-green-600',
  },
  {
    titre: 'Étudiants',
    description: 'Logements près des universités',
    icone: GraduationCap,
    lien: '/annonces?duree=etudiant',
    couleur: 'bg-purple-600',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative"
        style={{ background: 'linear-gradient(135deg, #C8102E 0%, #9e0c23 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Trouvez votre logement
            <br />
            <span className="text-red-200">idéal en Tunisie</span>
          </h1>

          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            Des milliers d&apos;annonces de location à travers toute la Tunisie. Appartements, maisons, villas, chambres.
          </p>

          {/* Barre de recherche */}
          <BarreRecherche />
        </div>
      </section>

      {/* Types de location */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Que recherchez-vous ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {typesLocation.map((type) => {
            const Icone = type.icone
            return (
              <Link
                key={type.titre}
                href={type.lien}
                className="group relative overflow-hidden rounded-2xl p-8 text-white transition-transform hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: type.couleur.replace('bg-', '').includes('blue')
                    ? '#2563eb'
                    : type.couleur.replace('bg-', '').includes('green')
                      ? '#16a34a'
                      : '#9333ea',
                }}
              >
                <Icone className="w-10 h-10 mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-1">{type.titre}</h3>
                <p className="text-sm opacity-80">{type.description}</p>
                <div className="absolute bottom-4 right-4 text-white/40 text-4xl font-black group-hover:text-white/20 transition-colors">
                  →
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Catégories */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Parcourir par catégorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icone = cat.icone
              return (
                <Link
                  key={cat.slug}
                  href={`/annonces?categorie=${cat.slug}`}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${cat.couleur} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icone className="w-7 h-7" />
                  </div>
                  <span className="font-semibold text-gray-800">{cat.nom}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Régions populaires */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Régions populaires</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/annonces?region=${region.slug}`}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-full hover:border-red-300 hover:text-red-600 transition-colors font-medium text-gray-700 shadow-sm hover:shadow-md"
            >
              <MapPin className="w-4 h-4" />
              {region.nom}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Propriétaires */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous avez un bien à louer ?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Déposez votre annonce gratuitement et trouvez des locataires rapidement dans toute la Tunisie.
          </p>
          <Link
            href="/ajouter"
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
            style={{ backgroundColor: '#C8102E' }}
          >
            Déposer une annonce gratuite
          </Link>
        </div>
      </section>
    </div>
  )
}