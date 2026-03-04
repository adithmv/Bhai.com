import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  const { access_token, user_id, district, bio, photo_url, skills, towns } = body

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${access_token}`,
    'Prefer': 'return=minimal',
  }

  // Insert worker
  const workerRes = await fetch(`${SUPABASE_URL}/rest/v1/workers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id: user_id, district, bio, photo_url }),
  })
  if (!workerRes.ok) {
    const err = await workerRes.json()
    return NextResponse.json({ error: err.message }, { status: workerRes.status })
  }

  // Insert skills
  const skillsRes = await fetch(`${SUPABASE_URL}/rest/v1/worker_skills`, {
    method: 'POST',
    headers,
    body: JSON.stringify(skills.map(s => ({ worker_id: user_id, category: s.category, skill: s.skill }))),
  })
  if (!skillsRes.ok) {
    const err = await skillsRes.json()
    return NextResponse.json({ error: err.message }, { status: skillsRes.status })
  }

  // Insert towns
  const townsRes = await fetch(`${SUPABASE_URL}/rest/v1/worker_towns`, {
    method: 'POST',
    headers,
    body: JSON.stringify(towns.map(t => ({ worker_id: user_id, town: t }))),
  })
  if (!townsRes.ok) {
    const err = await townsRes.json()
    return NextResponse.json({ error: err.message }, { status: townsRes.status })
  }

  return NextResponse.json({ success: true })
}