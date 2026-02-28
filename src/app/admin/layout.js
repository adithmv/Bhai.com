'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, Users, AlertTriangle, LogOut } from 'lucide-react'

export default function AdminLayout({ children }) {
  const [profile, setProfile] = useState(null)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (!data || data.role !== 'admin') { router.push('/auth/login'); return }
      setProfile(data)
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { href: '/admin/workers', label: 'Workers', Icon: Users },
    { href: '/admin/reports', label: 'Reports', Icon: AlertTriangle },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', fontFamily: "'DM Sans', sans-serif", display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .nav-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1rem; border-radius: 8px;
          text-decoration: none; font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 500; color: #888;
          transition: all 0.2s; cursor: pointer; border: none; background: none; width: 100%;
        }
        .nav-item:hover { background: #fff4ea; color: #2d2d2d; }
        .nav-item.active { background: #fdf5f5; color: #bf4646; font-weight: 600; }
        .sidebar { width: 220px; background: white; border-right: 1px solid #eddcc6; display: flex; flex-direction: column; padding: 1.5rem 1rem; position: fixed; top: 0; left: 0; height: 100vh; z-index: 40; flex-shrink: 0; }
        .main-content { margin-left: 220px; flex: 1; padding: 2rem; max-width: calc(100% - 220px); }
        @media (max-width: 768px) {
          .sidebar { width: 100%; height: auto; position: sticky; top: 0; flex-direction: row; padding: 0.75rem 1rem; border-right: none; border-bottom: 1px solid #eddcc6; align-items: center; justify-content: space-between; }
          .main-content { margin-left: 0; max-width: 100%; padding: 1.5rem 1rem; }
          .sidebar-logo { display: none; }
          .sidebar-profile { display: none; }
          .nav-items { display: flex; flex-direction: row; gap: 0.25rem; }
          .nav-item { padding: 0.5rem 0.75rem; font-size: 0.78rem; }
          .nav-item span { display: none; }
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo" style={{ marginBottom: '2rem' }}>
          <Image src="/logo.png" alt="Bhai.com" width={100} height={32} style={{ objectFit: 'contain' }} />
          <p className="sans" style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginTop: '0.5rem' }}>Admin Panel</p>
        </div>

        <div className="nav-items" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {navItems.map(({ href, label, Icon }) => (
            <a key={href} href={href} className={`nav-item ${pathname === href ? 'active' : ''}`}>
              <Icon size={17} strokeWidth={1.75} />
              <span>{label}</span>
            </a>
          ))}
        </div>

        <div className="sidebar-profile" style={{ borderTop: '1px solid #eddcc6', paddingTop: '1rem', marginTop: '1rem' }}>
          <p className="sans" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '0.25rem' }}>{profile?.full_name}</p>
          <p className="sans" style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '0.75rem' }}>Administrator</p>
          <button onClick={handleLogout} className="nav-item" style={{ color: '#bf4646', padding: '0.5rem 0' }}>
            <LogOut size={15} strokeWidth={1.75} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile logout */}
        <button onClick={handleLogout} className="nav-item" style={{ color: '#bf4646', display: 'none' }} id="mobile-logout">
          <LogOut size={17} strokeWidth={1.75} />
        </button>
      </div>

      {/* Main */}
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}
