'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Users, Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, users: 0, reports: 0 })
  const [recentWorkers, setRecentWorkers] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const [pending, approved, users, reports, workers] = await Promise.all([
        supabase.from('workers').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('workers').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'user'),
        supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('workers').select('*, profiles(full_name)').eq('status', 'pending').order('created_at', { ascending: false }).limit(4),
      ])
      setStats({ pending: pending.count || 0, approved: approved.count || 0, users: users.count || 0, reports: reports.count || 0 })
      setRecentWorkers(workers.data || [])
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Pending Approvals', value: stats.pending, Icon: Clock, color: '#bf9c4e', bg: '#fdf8ee', href: '/admin/workers' },
    { label: 'Approved Workers', value: stats.approved, Icon: CheckCircle, color: '#4e8c6b', bg: '#eef7f2', href: '/admin/workers' },
    { label: 'Total Users', value: stats.users, Icon: Users, color: '#7eacb5', bg: '#f0f7f8', href: null },
    { label: 'Pending Reports', value: stats.reports, Icon: AlertTriangle, color: '#bf4646', bg: '#fdf0f0', href: '/admin/reports' },
  ]

  return (
    <div>
      <style>{`
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .stat-card { background: white; border: 1px solid #eddcc6; border-radius: 10px; padding: 1.5rem; display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; transition: all 0.2s; text-decoration: none; }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .worker-row { display: flex; align-items: center; gap: 1rem; padding: 0.875rem 1.25rem; border-bottom: 1px solid #f5ede3; }
        .worker-row:last-child { border-bottom: none; }
        .approve-btn { padding: 0.45rem 1rem; background: #4e8c6b; color: white; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.75rem; cursor: pointer; border-radius: 6px; transition: background 0.2s; }
        .approve-btn:hover { background: #3d7058; }
      `}</style>

      <div style={{ marginBottom: '2rem' }}>
        <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Overview</p>
        <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>Dashboard</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map(s => (
          <a key={s.label} href={s.href || '#'} className="stat-card" style={{ pointerEvents: s.href ? 'auto' : 'none' }}>
            <div>
              <p className="sans" style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.5rem' }}>{s.label}</p>
              <p className="serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#2d2d2d' }}>{s.value}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.Icon size={18} color={s.color} strokeWidth={1.75} />
            </div>
          </a>
        ))}
      </div>

      {/* Recent pending workers */}
      {recentWorkers.length > 0 && (
        <div style={{ background: 'white', border: '1px solid #eddcc6', borderRadius: '10px' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #f5ede3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d' }}>Pending Approvals</p>
            <a href="/admin/workers" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#bf4646', textDecoration: 'none', fontWeight: 600 }}>
              View all <ArrowRight size={12} />
            </a>
          </div>
          {recentWorkers.map(w => (
            <div key={w.id} className="worker-row">
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #eddcc6', flexShrink: 0 }}>
                <img src={w.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d' }}>{w.profiles?.full_name}</p>
                <p className="sans" style={{ fontSize: '0.75rem', color: '#aaa' }}>{w.district}</p>
              </div>
              <a href="/admin/workers" className="approve-btn">Review</a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
