import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TunisiaRent — Location Immobilière en Tunisie',
  description: 'Trouvez votre logement idéal en Tunisie. Appartements, maisons, villas, chambres à louer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
          <p>© 2026 TunisiaRent — Tous droits réservés</p>
        </footer>
      </body>
    </html>
  )
}