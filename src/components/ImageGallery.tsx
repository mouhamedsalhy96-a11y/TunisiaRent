'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  images: string[] | null | undefined
  titre: string
}

export default function ImageGallery({ images, titre }: Props) {
  const [imageIndex, setImageIndex] = useState(0)

  const hasImages = images && images.length > 0

  const handlePrev = () => {
    setImageIndex((prev) => (prev === 0 ? images!.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setImageIndex((prev) => (prev === images!.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-gray-100 h-72 md:h-96 mb-6 relative">
      {hasImages ? (
        <>
          <img
            src={images[imageIndex]}
            alt={`${titre} - Photo ${imageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation - only show if multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                {imageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-7xl mb-3">🏠</div>
            <p>Aucune photo disponible</p>
          </div>
        </div>
      )}
    </div>
  )
}
