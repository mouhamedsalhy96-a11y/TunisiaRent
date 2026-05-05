import { Suspense } from 'react'
import DejaInscritClient from './DejaInscritClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <DejaInscritClient />
    </Suspense>
  )
}