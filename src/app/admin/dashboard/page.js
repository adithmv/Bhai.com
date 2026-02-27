'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingWorkers: 0,
    approvedWorkers: 0,
    totalUsers: 0,
    pendingReports: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const [pending, approved, users, reports] = await Promise.all([
        supabase.from('workers').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('workers').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
        supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending'),
      ])

      setStats({
        pendingWorkers: pending.count || 0,
        approvedWorkers: approved.count || 0,
        totalUsers: users.count || 0,
        pendingReports: reports.count || 0,
      })
    }

    fetchStats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cards = [
    { label: 'Pending Approvals', value: stats.pendingWorkers, color: 'text-yellow-400' },
    { label: 'Approved Workers', value: stats.approvedWorkers, color: 'text-green-400' },
    { label: 'Total Users', value: stats.totalUsers, color: 'text-blue-400' },
    { label: 'Pending Reports', value: stats.pendingReports, color: 'text-red-400' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-gray-900 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-2">{card.label}</p>
            <p className={`text-5xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}