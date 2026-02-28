import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  const { action, ...data } = body

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let endpoint = ''
  if (action === 'login') endpoint = `${SUPABASE_URL}/auth/v1/token?grant_type=password`
  if (action === 'register') endpoint = `${SUPABASE_URL}/auth/v1/signup`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  return NextResponse.json(result, { status: response.status })
}