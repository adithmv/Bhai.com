import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    let endpoint = ''
    if (action === 'login') endpoint = `${SUPABASE_URL}/auth/v1/token?grant_type=password`
    if (action === 'register') endpoint = `${SUPABASE_URL}/auth/v1/signup`
    if (!endpoint) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

    const authRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })

    const authData = await authRes.json()
    if (!authRes.ok) return NextResponse.json(authData, { status: authRes.status })

    if (action === 'login' && authData.access_token) {
      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${authData.user.id}&select=role`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${authData.access_token}`,
          },
        }
      )
      const profiles = await profileRes.json()
      authData.profile = profiles?.[0] || null
    }

    if (action === 'register' && authData.access_token) {
      await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${authData.access_token}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          id: authData.user.id,
          full_name: data.full_name,
          phone: data.phone,
          role: data.role,
        }),
      })
    }

    return NextResponse.json(authData)

  } catch (err) {
    console.error('Auth proxy error:', err)
    return NextResponse.json({ error: 'Internal server error', detail: err.message }, { status: 500 })
  }
}