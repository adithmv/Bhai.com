import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const response = NextResponse.next()
  const path = request.nextUrl.pathname

  // Check our manual cookie first
  const accessToken = request.cookies.get('sb-access-token')?.value

  if (!accessToken && (
    path.startsWith('/user') ||
    path.startsWith('/worker') ||
    path.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/user/:path*', '/worker/:path*', '/admin/:path*'],
}