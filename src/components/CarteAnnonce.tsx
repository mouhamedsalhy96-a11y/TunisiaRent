'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Sofa, ChevronLeft, ChevronRight } from 'lucide-react'
import { Listing, LABELS_DUREE, COULEURS_DUREE } from '@/lib/types'

type Props = {
  annonce: Listing
}

export default function CarteAnnonce({ annonce }: Props) {
  const [imageIndex, setImageIndex] = useState(0)
  
  const labelDuree = LABELS_DUREE[annonce.type_duree] ?? annonce.type_duree
  const couleurDuree = COULEURS_DUREE[annonce.type_duree] ?? 'bg-gray-100 text-gray-700'
  
  const hasImages = annonce.images && annonce.images.length > 0
  const currentImage = hasImages ? annonce.images[imageIndex] : null
  
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    setImageIndex((prev) => (prev === 0 ? annonce.images!.length - 1 : prev - 1))
  }
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    setImageIndex((prev) => (prev === annonce.images!.length - 1 ? 0 : prev + 1))
  }

  return (
    <Link href={`/annonces/${annonce.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200">
        {/* Image */}
        <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {currentImage ? (
            <img
              src={currentImage}
              alt={annonce.titre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-5xl mb-2">🏠</div>
                <p className="text-sm">Pas de photo</p>
              </div>
            </div>
          )}
          
          {/* Navigation buttons - only show if multiple images */}
          {hasImages && annonce.images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* Image counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {imageIndex + 1}/{annonce.images.length}
              </div>
            </>
          )}
          
          {/* Badge durée */}
          <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${couleurDuree}`}>
            {labelDuree}
          </span>
          {/* Badge meublé */}
          {annonce.meuble && (
            <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
              Meublé
            </span>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          {/* Catégorie */}
          {annonce.categories && (
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-medium">
              {annonce.categories.nom}
            </p>
          )}

          {/* Titre */}
          <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
            {annonce.titre}
          </h3>

          {/* Localisation */}
          {annonce.regions && (
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{annonce.regions.nom}</span>
              {annonce.adresse && (
                <span className="truncate text-gray-400"> · {annonce.adresse}</span>
              )}
            </div>
          )}

          {/* Caractéristiques */}
          <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {annonce.chambres} ch.
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {annonce.salles_bain} sdb
            </span>
            {annonce.superficie && (
              <span className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                {annonce.superficie} m²
              </span>
            )}
            {annonce.meuble && (
              <span className="flex items-center gap-1">
                <Sofa className="w-4 h-4" />
                Meublé
              </span>
            )}
          </div>

          {/* Prix */}
          <div className="flex items-center justify-between border-t border-gray-50 pt-3">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {annonce.prix.toLocaleString('fr-TN')} TND
              </span>
              <span className="text-gray-400 text-sm"> / mois</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(annonce.created_at).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
