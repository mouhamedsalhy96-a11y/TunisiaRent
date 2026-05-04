'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react'

type Props = {
  onImagesChange: (urls: string[]) => void
  images: string[]
}

export default function UploadPhotos({ onImagesChange, images }: Props) {
  const [uploading, setUploading] = useState(false)
  const [erreur, setErreur] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFichiers(e: React.ChangeEvent<HTMLInputElement>) {
    const fichiers = Array.from(e.target.files ?? [])
    if (fichiers.length === 0) return

    if (images.length + fichiers.length > 6) {
      setErreur('Maximum 6 photos par annonce.')
      return
    }

    setUploading(true)
    setErreur('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const nouvellesUrls: string[] = []

    for (const fichier of fichiers) {
      if (fichier.size > 5 * 1024 * 1024) {
        setErreur('Chaque photo doit faire moins de 5 Mo.')
        continue
      }

      const ext = fichier.name.split('.').pop()
      const nomFichier = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from('annonces')
        .upload(nomFichier, fichier, { cacheControl: '3600', upsert: false })

      if (error) {
        setErreur('Erreur upload : ' + error.message)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('annonces')
        .getPublicUrl(nomFichier)

      nouvellesUrls.push(urlData.publicUrl)
    }

    onImagesChange([...images, ...nouvellesUrls])
    setUploading(false)

    if (inputRef.current) inputRef.current.value = ''
  }

  function supprimerImage(url: string) {
    onImagesChange(images.filter(u => u !== url))
  }

  return (
    <div>
      {/* Grille photos */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {images.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-2 left-2 text-xs font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full">
                  Principale
                </span>
              )}
              <button
                type="button"
                onClick={() => supprimerImage(url)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Slot ajouter si moins de 6 */}
          {images.length < 6 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-red-300 hover:bg-red-50 transition-colors text-gray-400 hover:text-red-400"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-xs">Ajouter</span>
            </button>
          )}
        </div>
      )}

      {/* Zone de drop initiale */}
      {images.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center gap-3 hover:border-red-300 hover:bg-red-50 transition-colors group"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-gray-300 group-hover:text-red-400 transition-colors" />
          )}
          <div className="text-center">
            <p className="font-medium text-gray-600 text-sm group-hover:text-red-500 transition-colors">
              {uploading ? 'Envoi en cours...' : 'Cliquer pour ajouter des photos'}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG · Max 5 Mo · 6 photos maximum</p>
          </div>
        </button>
      )}

      {uploading && images.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Envoi en cours...
        </div>
      )}

      {erreur && (
        <p className="text-red-500 text-sm mt-2">{erreur}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFichiers}
      />
    </div>
  )
}