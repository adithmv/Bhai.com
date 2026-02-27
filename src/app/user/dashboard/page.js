'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function UserDashboard() {
  const [profile, setProfile] = useState(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
    }
    fetchProfile()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-orange-500">bhai.com</h1>
        <div className="flex items-center gap-4">
          <a href="/user/bookings" className="text-gray-300 hover:text-orange-400 transition text-sm">My Bookings</a>
          <a href="/user/browse" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">Find a Bhai</a>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-3">
          Welcome back, {profile?.full_name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-400 text-lg mb-8">Find the right Bhai for any job around your home</p>
        <a href="/user/browse" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition">
          Find a Bhai Now
        </a>
      </div>
    </div>
  )
}
