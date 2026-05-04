import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const routesProtegees = ['/ajouter', '/dashboard']
  const estRouteProtegee = routesProtegees.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (estRouteProtegee && !user) {
    return NextResponse.redirect(new URL('/connexion', request.url))
  }

  // Rediriger vers dashboard si déjà connecté et on va sur connexion/inscription
  const routesAuth = ['/connexion', '/inscription']
  const estRouteAuth = routesAuth.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (estRouteAuth && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/ajouter', '/dashboard', '/connexion', '/inscription'],
}