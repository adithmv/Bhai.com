'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/shared/LogoutButton'

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        router.push('/auth/login')
        return
      }

      setLoading(false)
    }

    checkAdmin()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-orange-500 mb-4">bhai.com Admin</h1>
        <a href="/admin/dashboard" className="text-gray-300 hover:text-orange-400 transition">Dashboard</a>
        <a href="/admin/workers" className="text-gray-300 hover:text-orange-400 transition">Worker Approvals</a>
        <a href="/admin/reports" className="text-gray-300 hover:text-orange-400 transition">Reports</a>
        </div>
        <div className="mt-auto">
            <LogoutButton />
        </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}