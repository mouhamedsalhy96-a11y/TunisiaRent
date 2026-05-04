'use client'
import { useState, useEffect, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { REGIONS } from '@/lib/regions'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import UploadPhotos from '@/components/UploadPhotos'

const CATEGORIES = [
  { id: 1, nom: 'Appartement' },
  { id: 2, nom: 'Maison' },
  { id: 3, nom: 'Villa' },
  { id: 4, nom: 'Chambre' },
  { id: 5, nom: 'Studio' },
]

const TYPES_DUREE = [
  { valeur: 'long_terme', label: 'Long terme' },
  { valeur: 'court_terme', label: 'Court terme' },
  { valeur: 'etudiant', label: '🎓 Étudiant' },
]

type FormState = {
  titre: string
  description: string
  prix: string
  type_duree: string
  category_id: string
  adresse: string
  chambres: string
  salles_bain: string
  superficie: string
  meuble: boolean
  region_slug: string
}

export default function PageAjouter() {
  const router = useRouter()
  const supabase = createClient()

  const [utilisateur, setUtilisateur] = useState<User | null>(null)
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const [form, setForm] = useState<FormState>({
    titre: '',
    description: '',
    prix: '',
    type_duree: 'long_terme',
    category_id: '1',
    adresse: '',
    chambres: '1',
    salles_bain: '1',
    superficie: '',
    meuble: false,
    region_slug: 'tunis',
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/connexion')
      } else {
        setUtilisateur(data.user)
      }
    })
  }, [])

  function champ<K extends keyof FormState>(key: K, valeur: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: valeur }))
  }

  async function handleSoumission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setChargement(true)
    setErreur('')

    // ✅ Guard required to use utilisateur.id safely (and remove underline)
    if (!utilisateur) {
      setErreur('Vous devez être connecté pour publier une annonce.')
      setChargement(false)
      return
    }

    // Validate images
    if (images.length === 0) {
      setErreur('Vous devez ajouter au moins une photo.')
      setChargement(false)
      return
    }

    const { data: regionData } = await supabase
      .from('regions')
      .select('id')
      .eq('slug', form.region_slug)
      .single()

    if (!regionData) {
      setErreur('Région introuvable.')
      setChargement(false)
      return
    }

    // Ensure images is a proper array
    const imageArray = Array.isArray(images) ? images : []

    const { error } = await supabase.from('listings').insert({
      titre: form.titre,
      description: form.description,
      prix: parseFloat(form.prix),
      type_duree: form.type_duree,
      category_id: parseInt(form.category_id),
      region_id: regionData.id,
      adresse: form.adresse,
      chambres: parseInt(form.chambres),
      salles_bain: parseInt(form.salles_bain),
      superficie: form.superficie ? parseFloat(form.superficie) : null,
      meuble: form.meuble,
      disponible: true,
      images: imageArray,
      user_id: utilisateur.id,
    })

    if (error) {
      setErreur('Erreur lors de la publication : ' + error.message)
      setChargement(false)
      return
    }

    setSucces(true)
    setChargement(false)
  }

  if (succes) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 shadow-sm text-center max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Annonce publiée !</h2>
          <p className="text-gray-500 mb-6">Votre annonce est maintenant visible par tous les visiteurs.</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/annonces"
              className="text-white font-semibold px-6 py-3 rounded-xl text-center"
              style={{ backgroundColor: '#C8102E' }}
            >
              Voir toutes les annonces
            </Link>
            <button
              onClick={() => {
                setSucces(false)
                setImages([])
                setForm({
                  titre: '',
                  description: '',
                  prix: '',
                  type_duree: 'long_terme',
                  category_id: '1',
                  adresse: '',
                  chambres: '1',
                  salles_bain: '1',
                  superficie: '',
                  meuble: false,
                  region_slug: 'tunis',
                })
              }}
              className="text-gray-600 font-medium px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50"
            >
              Déposer une autre annonce
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Déposer une annonce</h1>
      <p className="text-gray-500 mb-8">Remplissez les informations de votre bien à louer</p>

      {erreur && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
          {erreur}
        </div>
      )}

      <form onSubmit={handleSoumission} className="flex flex-col gap-6">
        {/* Infos de base */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Informations principales</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre de l&apos;annonce *</label>
              <input
                type="text"
                value={form.titre}
                onChange={e => champ('titre', e.target.value)}
                required
                maxLength={120}
                placeholder="Ex: Bel appartement meublé à Tunis centre"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => champ('description', e.target.value)}
                rows={4}
                placeholder="Décrivez votre bien : étage, vue, équipements, proximité des transports..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Type et catégorie */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Type de location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Catégorie *</label>
              <select
                value={form.category_id}
                onChange={e => champ('category_id', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 transition-all bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Durée *</label>
              <select
                value={form.type_duree}
                onChange={e => champ('type_duree', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 transition-all bg-white"
              >
                {TYPES_DUREE.map(t => (
                  <option key={t.valeur} value={t.valeur}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Boutons durée visuels */}
          <div className="flex gap-2 mt-4">
            {TYPES_DUREE.map(t => (
              <button
                key={t.valeur}
                type="button"
                onClick={() => champ('type_duree', t.valeur)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  form.type_duree === t.valeur
                    ? 'text-white border-transparent'
                    : 'text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
                style={form.type_duree === t.valeur ? { backgroundColor: '#C8102E', borderColor: '#C8102E' } : {}}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Localisation</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gouvernorat *</label>
              <select
                value={form.region_slug}
                onChange={e => champ('region_slug', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 transition-all bg-white"
              >
                {REGIONS.map(r => (
                  <option key={r.slug} value={r.slug}>
                    {r.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse précise</label>
              <input
                type="text"
                value={form.adresse}
                onChange={e => champ('adresse', e.target.value)}
                placeholder="Ex: Rue de la liberté, Cité El Khadra"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Caractéristiques du bien</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Chambres *</label>
              <select
                value={form.chambres}
                onChange={e => champ('chambres', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 transition-all bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>
                    {n} chambre{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Salles de bain *</label>
              <select
                value={form.salles_bain}
                onChange={e => champ('salles_bain', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 transition-all bg-white"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>
                    {n} salle{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Superficie (m²)</label>
              <input
                type="number"
                value={form.superficie}
                onChange={e => champ('superficie', e.target.value)}
                placeholder="Ex: 85"
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>
          </div>

          {/* Meublé toggle */}
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-800 text-sm">Bien meublé</p>
              <p className="text-xs text-gray-400 mt-0.5">Le logement est livré avec les meubles</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{form.meuble ? 'Oui' : 'Non'}</span>
              <button
                type="button"
                role="switch"
                aria-checked={form.meuble}
                onClick={() => setForm(prev => ({ ...prev, meuble: !prev.meuble }))}
                className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
                style={{ backgroundColor: form.meuble ? '#C8102E' : '#D1D5DB' }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                  style={{ transform: form.meuble ? 'translateX(24px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Prix */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Prix</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Loyer mensuel (TND) *</label>
            <div className="relative">
              <input
                type="number"
                value={form.prix}
                onChange={e => champ('prix', e.target.value)}
                required
                min="1"
                placeholder="Ex: 800"
                className="w-full pl-4 pr-16 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">TND</span>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
           <h2 className="font-semibold text-gray-800 mb-1">Photos *</h2>
           <p className="text-xs text-gray-400 mb-4">La première photo sera la photo principale de l&apos;annonce</p>
           <UploadPhotos images={images} onImagesChange={setImages} />
           {images.length === 0 && (
             <p className="text-red-500 text-xs mt-2">Au moins une photo est requise</p>
           )}
        </div>

        {/* Bouton soumettre */}
        <button
          type="submit"
          disabled={chargement || images.length === 0}
          className="w-full text-white font-semibold py-4 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-60 text-base"
          style={{ backgroundColor: '#C8102E' }}
        >
          {chargement ? 'Publication en cours...' : 'Publier mon annonce'}
        </button>
      </form>
    </div>
  )
}
