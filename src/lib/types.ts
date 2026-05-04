export type Region = {
  id: number
  nom: string
  slug: string
}

export type Categorie = {
  id: number
  nom: string
  slug: string
  icone: string
}

export type Listing = {
  id: string
  titre: string
  description: string | null
  prix: number
  type_duree: 'court_terme' | 'long_terme' | 'etudiant'
  category_id: number
  region_id: number
  adresse: string | null
  chambres: number
  salles_bain: number
  superficie: number | null
  meuble: boolean
  disponible: boolean
  images: string[]
  user_id: string | null
  created_at: string
  categories?: Categorie
  regions?: Region
}

export const LABELS_DUREE: Record<string, string> = {
  court_terme: 'Court terme',
  long_terme: 'Long terme',
  etudiant: 'Étudiant',
}

export const COULEURS_DUREE: Record<string, string> = {
  court_terme: 'bg-green-100 text-green-700',
  long_terme: 'bg-blue-100 text-blue-700',
  etudiant: 'bg-purple-100 text-purple-700',
}