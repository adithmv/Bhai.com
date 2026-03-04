import { NextResponse } from 'next/server'

export async function middleware(request) {
  const path = request.nextUrl.pathname
  const accessToken = request.cookies.get('sb-access-token')?.value

  console.log('MIDDLEWARE PATH:', path)
  console.log('MIDDLEWARE COOKIE:', accessToken ? 'found' : 'missing')
  console.log('ALL COOKIES:', request.cookies.getAll().map(c => c.name))

  if (!accessToken && (
    path.startsWith('/user') ||
    path.startsWith('/worker') ||
    path.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/worker/:path*', '/admin/:path*'],
}