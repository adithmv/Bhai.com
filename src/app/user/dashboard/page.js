'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, ClipboardList, LogOut, ArrowRight, Wrench, Star, MapPin } from 'lucide-react'
import LogoutButton from '@/components/shared/LogoutButton'
import NotificationBell from '@/components/shared/NotificationBell'
import Link from 'next/link'

export default function UserDashboard() {
  const [profile, setProfile] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', user.id).single()
      setProfile(profileData)

      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, workers(photo_url, district, profiles(full_name))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
      setRecentBookings(bookings || [])
    }
    fetchData()
  }, [])

  const statusColor = { pending: '#bf9c4e', approved: '#4e8c6b', rejected: '#bf4646', completed: '#7eacb5' }
  const statusLabel = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', completed: 'Completed' }

  return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .nav { background: white; border-bottom: 1px solid #eddcc6; padding: 0 1.5rem; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .card { background: white; border: 1px solid #eddcc6; border-radius: 10px; }
        .action-btn {
          display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
          background: white; border: 1px solid #eddcc6; border-radius: 10px;
          padding: 1.5rem 1rem; cursor: pointer; transition: all 0.2s;
          text-decoration: none; flex: 1;
        }
        .action-btn:hover { border-color: #bf4646; box-shadow: 0 4px 16px rgba(191,70,70,0.08); transform: translateY(-2px); }
        .booking-row { padding: 1rem 1.25rem; border-bottom: 1px solid #f5ede3; display: flex; align-items: center; gap: 1rem; }
        .booking-row:last-child { border-bottom: none; }
      `}</style>

      {/* Navbar */}
      <nav className="nav">
        <Image src="/logo.png" alt="Bhai.com" width={90} height={28} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a href="/user/bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#888', textDecoration: 'none', fontWeight: 500 }}>
            <ClipboardList size={15} color="#888" /> Bookings
          </a>
          <NotificationBell />
          <LogoutButton />
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Greeting */}
        <div style={{ marginBottom: '2rem' }}>
          <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Dashboard</p>
          <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>
            Hello, {profile?.full_name?.split(' ')[0]}
          </h1>
          <p className="sans" style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.25rem' }}>What do you need help with today?</p>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <link href="/user/browse" className="action-btn">
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fdf5f5', border: '1px solid #eddcc6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={20} color="#bf4646" strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d' }}>Find a Bhai</p>
              <p className="sans" style={{ fontSize: '0.75rem', color: '#aaa' }}>Search workers</p>
            </div>
          </link>
          <a href="/user/bookings" className="action-btn">
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f0f7f8', border: '1px solid #c5dde0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={20} color="#7eacb5" strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d' }}>My Bookings</p>
              <p className="sans" style={{ fontSize: '0.75rem', color: '#aaa' }}>View requests</p>
            </div>
          </a>
        </div>

        {/* Recent bookings */}
        <div className="card">
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #f5ede3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d' }}>Recent Bookings</p>
            <a href="/user/bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#bf4646', textDecoration: 'none', fontWeight: 600 }}>
              View all <ArrowRight size={12} />
            </a>
          </div>

          {recentBookings.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Wrench size={32} color="#ddd" strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
              <p className="sans" style={{ fontSize: '0.875rem', color: '#bbb', marginBottom: '1rem' }}>No bookings yet</p>
              <link href="/user/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#bf4646', color: 'white', fontSize: '0.82rem', fontWeight: 600, padding: '0.6rem 1.25rem', borderRadius: '6px', textDecoration: 'none' }}>
                Find a Bhai <ArrowRight size={13} />
              </link>
            </div>
          ) : (
            recentBookings.map(b => (
              <div key={b.id} className="booking-row">
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f5ede3', overflow: 'hidden', flexShrink: 0, border: '1px solid #eddcc6' }}>
                  {b.workers?.photo_url
                    ? <img src={b.workers.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wrench size={16} color="#bf4646" strokeWidth={1.5} /></div>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d' }}>{b.workers?.profiles?.full_name}</p>
                  <p className="sans" style={{ fontSize: '0.75rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={11} /> {b.workers?.district} · {new Date(b.work_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: statusColor[b.status], background: statusColor[b.status] + '15', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                  {statusLabel[b.status]}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
