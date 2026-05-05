import { Suspense } from 'react'
import VerifierEmailClient from './VerifierEmailClient'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <VerifierEmailClient />
    </Suspense>
  )
}