import { NextResponse } from 'next/server'

export async function POST(request) {
  const formData = await request.formData()
  const file = formData.get('file')
  const path = formData.get('path')

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const accessToken = formData.get('access_token')

  const fileBuffer = await file.arrayBuffer()

  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/worker-photos/${path}`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': file.type,
        'x-upsert': 'true',
      },
      body: fileBuffer,
    }
  )

  const result = await uploadRes.json()
  if (!uploadRes.ok) return NextResponse.json(result, { status: uploadRes.status })

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/worker-photos/${path}`
  return NextResponse.json({ publicUrl })
}