import { Suspense } from 'react'
import ConnexionClient from './ConnexionClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ConnexionClient />
    </Suspense>
  )
}