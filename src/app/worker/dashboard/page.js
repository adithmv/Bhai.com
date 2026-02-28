'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ClipboardList, CheckCircle, XCircle, Clock, Phone, Calendar, ChevronRight, Wrench, HardHat } from 'lucide-react'
import LogoutButton from '@/components/shared/LogoutButton'

export default function WorkerDashboard() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('pending')
  const [profile, setProfile] = useState(null)
  const [workerStatus, setWorkerStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profileData)
      const { data: workerData } = await supabase.from('workers').select('status').eq('id', user.id).single()
      setWorkerStatus(workerData?.status)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (workerStatus === 'approved') fetchBookings()
  }, [filter, workerStatus])

  const fetchBookings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('bookings')
      .select('*, profiles(full_name, phone)')
      .eq('worker_id', user.id)
      .eq('status', filter)
      .order('work_date', { ascending: true })
    setBookings(data || [])
  }

  const updateBooking = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings()
  }

  const tabs = ['pending', 'approved', 'rejected', 'completed']

  const statusConfig = {
    pending: { color: '#bf9c4e', bg: '#fdf8ee', Icon: Clock },
    approved: { color: '#4e8c6b', bg: '#eef7f2', Icon: CheckCircle },
    rejected: { color: '#bf4646', bg: '#fdf0f0', Icon: XCircle },
    completed: { color: '#7eacb5', bg: '#f0f7f8', Icon: ClipboardList },
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans', color: '#aaa' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .nav { background: white; border-bottom: 1px solid #eddcc6; padding: 0 1.5rem; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .tab { padding: 0.5rem 1rem; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; cursor: pointer; border-radius: 20px; transition: all 0.2s; color: #888; text-transform: capitalize; }
        .tab.active { background: #bf4646; color: white; font-weight: 600; }
        .booking-card { background: white; border: 1px solid #eddcc6; border-radius: 10px; overflow: hidden; margin-bottom: 1rem; }
        .accept-btn { padding: 0.6rem 1.25rem; background: #4e8c6b; color: white; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; }
        .accept-btn:hover { background: #3d7058; }
        .reject-btn { padding: 0.6rem 1.25rem; background: #fdf0f0; color: #bf4646; border: 1px solid #f5c6c6; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem; }
        .reject-btn:hover { background: #f5d5d5; }
        .done-btn { padding: 0.6rem 1.25rem; background: #7eacb5; color: white; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem; cursor: pointer; border-radius: 6px; transition: all 0.2s; }
        .done-btn:hover { background: #6a9aa3; }
        .status-card { background: white; border: 1px solid #eddcc6; border-radius: 10px; padding: 3rem 2rem; text-align: center; }
      `}</style>

      <nav className="nav">
        <Image src="/logo.png" alt="Bhai.com" width={90} height={28} style={{ objectFit: 'contain' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <p className="sans" style={{ fontSize: '0.82rem', color: '#888' }}>
            {profile?.full_name?.split(' ')[0]}
          </p>
          <LogoutButton />
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Worker Dashboard</p>
          <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>
            Hello, {profile?.full_name?.split(' ')[0]}
          </h1>
        </div>

        {/* Pending state */}
        {workerStatus === 'pending' && (
          <div className="status-card">
            <div style={{ width: '56px', height: '56px', background: '#fdf8ee', border: '1px solid #eddcc6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Clock size={24} color="#bf9c4e" strokeWidth={1.5} />
            </div>
            <h2 className="serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2d2d2d', marginBottom: '0.5rem' }}>Profile Under Review</h2>
            <p className="sans" style={{ fontSize: '0.875rem', color: '#aaa', lineHeight: 1.7 }}>Your profile is being reviewed by our admin team. We will contact you shortly.</p>
          </div>
        )}

        {workerStatus === 'rejected' && (
          <div className="status-card">
            <div style={{ width: '56px', height: '56px', background: '#fdf0f0', border: '1px solid #f5c6c6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <XCircle size={24} color="#bf4646" strokeWidth={1.5} />
            </div>
            <h2 className="serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2d2d2d', marginBottom: '0.5rem' }}>Profile Rejected</h2>
            <p className="sans" style={{ fontSize: '0.875rem', color: '#aaa', lineHeight: 1.7 }}>Your profile was not approved. Please contact support for more information.</p>
          </div>
        )}

        {workerStatus === 'banned' && (
          <div className="status-card">
            <div style={{ width: '56px', height: '56px', background: '#fdf0f0', border: '1px solid #f5c6c6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <HardHat size={24} color="#bf4646" strokeWidth={1.5} />
            </div>
            <h2 className="serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2d2d2d', marginBottom: '0.5rem' }}>Account Banned</h2>
            <p className="sans" style={{ fontSize: '0.875rem', color: '#aaa', lineHeight: 1.7 }}>Your account has been banned. Please contact support.</p>
          </div>
        )}

        {workerStatus === 'approved' && (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'white', padding: '0.4rem', borderRadius: '30px', border: '1px solid #eddcc6', flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setFilter(t)} className={`tab ${filter === t ? 'active' : ''}`}>{t}</button>
              ))}
            </div>

            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', border: '1px solid #eddcc6', borderRadius: '10px' }}>
                <Wrench size={32} color="#ddd" strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
                <p className="sans" style={{ fontSize: '0.875rem', color: '#bbb' }}>No {filter} bookings.</p>
              </div>
            ) : (
              bookings.map(booking => {
                const sc = statusConfig[booking.status]
                return (
                  <div key={booking.id} className="booking-card">
                    <div style={{ padding: '1.25rem' }}>

                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <p className="sans" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d2d2d', marginBottom: '0.25rem' }}>{booking.profiles?.full_name}</p>
                          <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={11} />
                            {new Date(booking.work_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: sc.color, background: sc.bg, padding: '0.25rem 0.75rem', borderRadius: '20px', flexShrink: 0, textTransform: 'capitalize' }}>
                          {booking.status}
                        </span>
                      </div>

                      {/* Phone shown only after approval */}
                      {booking.status === 'approved' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#eef7f2', border: '1px solid #b8deca', padding: '0.6rem 0.875rem', borderRadius: '6px', marginBottom: '0.875rem' }}>
                          <Phone size={13} color="#4e8c6b" />
                          <p className="sans" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4e8c6b' }}>{booking.profiles?.phone}</p>
                        </div>
                      )}

                      {/* Work description */}
                      <div style={{ background: '#fff4ea', padding: '0.875rem', borderRadius: '6px', marginBottom: '1rem' }}>
                        <p className="sans" style={{ fontSize: '0.82rem', color: '#888', lineHeight: 1.6 }}>{booking.work_description}</p>
                      </div>

                      {/* Actions */}
                      {filter === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button onClick={() => updateBooking(booking.id, 'approved')} className="accept-btn">
                            <CheckCircle size={14} /> Accept
                          </button>
                          <button onClick={() => updateBooking(booking.id, 'rejected')} className="reject-btn">
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      )}

                      {filter === 'approved' && (
                        <button onClick={() => updateBooking(booking.id, 'completed')} className="done-btn">
                          Mark as Done
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}
      </div>
    </div>
  )
}
