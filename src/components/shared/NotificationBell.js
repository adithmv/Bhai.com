'use client'
import { getUserFromStorage } from '@/lib/getUser'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { Bell, CheckCheck, X } from 'lucide-react'

export default function NotificationBell() {
  const supabase = createClient()
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef()

  const unread = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    let channel

    const init = async () => {
      

const user = getUserFromStorage()
if (!user) { router.push('/auth/login'); return }

      // Load existing notifications
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
      setNotifications(data || [])

      // Realtime subscription
      channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            setNotifications(prev => [payload.new, ...prev].slice(0, 20))
          }
        )
        .subscribe()
    }

    init()
    return () => { if (channel) supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    if (unreadIds.length === 0) return
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const markRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const timeAgo = (ts) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead() }}
        style={{ position: 'relative', width: '36px', height: '36px', background: unread > 0 ? '#fff4ea' : 'transparent', border: `1px solid ${unread > 0 ? '#eddcc6' : 'transparent'}`, borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
      >
        <Bell size={18} color={unread > 0 ? '#bf4646' : '#aaa'} strokeWidth={unread > 0 ? 2 : 1.5} />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#bf4646', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '320px', background: 'white', border: '1px solid #eddcc6', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 200, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #eddcc6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, color: '#2d2d2d' }}>Notifications</p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#7eacb5', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex' }}>
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                <Bell size={28} color="#ddd" strokeWidth={1} style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#bbb' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f5f0ea', background: n.is_read ? 'white' : '#fffbf7', cursor: 'pointer', transition: 'background 0.15s' }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.is_read ? 'transparent' : '#bf4646', marginTop: '5px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '0.2rem' }}>{n.title}</p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#888', lineHeight: 1.5 }}>{n.body}</p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.68rem', color: '#bbb', marginTop: '0.35rem' }}>{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}