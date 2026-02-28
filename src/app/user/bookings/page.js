'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, MapPin, Phone, Star, X, Wrench, AlertTriangle, ArrowRight, Calendar } from 'lucide-react'
import LogoutButton from '@/components/shared/LogoutButton'
import NotificationBell from '@/components/shared/NotificationBell'

export default function UserBookings() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewForm, setReviewForm] = useState({ rating: 0, description: '' })
  const [reviewError, setReviewError] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reportModal, setReportModal] = useState(null)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [reportError, setReportError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  // eslint-disable-next-line react-hooks/immutability
  useEffect(() => { fetchBookings() }, [filter])

  const fetchBookings = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { data } = await supabase
      .from('bookings')
      .select('*, workers(photo_url, district, profiles(full_name, phone)), reviews(id)')
      .eq('user_id', user.id)
      .eq('status', filter)
      .order('work_date', { ascending: true })
    setBookings(data || [])
    setLoading(false)
  }

  const canReview = (booking) => {
    if (booking.status !== 'approved' && booking.status !== 'completed') return false
    if (booking.reviews?.length > 0) return false
    const workDate = new Date(booking.work_date)
    const today = new Date(); today.setHours(0,0,0,0)
    return workDate <= today
  }

  const handleReviewSubmit = async () => {
    setReviewError('')
    if (reviewForm.rating === 0) { setReviewError('Please select a rating.'); return }
    if (reviewForm.rating < 3 && !reviewForm.description.trim()) { setReviewError('Description is required for ratings below 3 stars.'); return }
    if (reviewForm.description.length > 200) { setReviewError('Description must be under 200 characters.'); return }
    setReviewSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('reviews').insert({ booking_id: reviewModal.id, user_id: user.id, worker_id: reviewModal.worker_id, rating: reviewForm.rating, description: reviewForm.description || null })
    if (error) { setReviewError(error.message); setReviewSubmitting(false); return }
    const { data: allReviews } = await supabase.from('reviews').select('rating').eq('worker_id', reviewModal.worker_id)
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    await supabase.from('workers').update({ average_rating: Math.round(avg * 10) / 10, total_reviews: allReviews.length }).eq('id', reviewModal.worker_id)
    setReviewModal(null); setReviewForm({ rating: 0, description: '' }); setReviewSubmitting(false); fetchBookings()
  }

  const handleReportSubmit = async () => {
    setReportError('')
    if (!reportReason.trim()) { setReportError('Please describe the issue.'); return }
    setReportSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('reports').insert({ booking_id: reportModal.id, user_id: user.id, worker_id: reportModal.worker_id, reason: reportReason })
    if (error) { setReportError(error.message); setReportSubmitting(false); return }
    setReportModal(null); setReportReason(''); setReportSubmitting(false); fetchBookings()
  }

  const statusConfig = {
    pending: { color: '#bf9c4e', bg: '#fdf8ee', label: 'Waiting for response' },
    approved: { color: '#4e8c6b', bg: '#eef7f2', label: 'Approved' },
    rejected: { color: '#bf4646', bg: '#fdf0f0', label: 'Rejected' },
    completed: { color: '#7eacb5', bg: '#f0f7f8', label: 'Completed' },
  }

  const tabs = ['pending', 'approved', 'rejected', 'completed']

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
        .booking-card { background: white; border: 1px solid #eddcc6; border-radius: 10px; overflow: hidden; }
        .action-btn { padding: 0.6rem 1rem; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.78rem; cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; gap: 0.35rem; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; padding: 1rem; z-index: 100; }
        .modal { background: white; border-radius: 12px; padding: 2rem; width: 100%; max-width: 400px; }
        .textarea-field { width: 100%; padding: 0.75rem; background: #fff4ea; border: 1.5px solid #eddcc6; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #2d2d2d; outline: none; border-radius: 6px; resize: none; }
        .textarea-field:focus { border-color: #bf4646; }
      `}</style>

      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a href="/user/dashboard" style={{ display: 'flex', alignItems: 'center', color: '#888', textDecoration: 'none' }}><ChevronLeft size={20} /></a>
          <Image src="/logo.png" alt="Bhai.com" width={80} height={26} style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/user/browse" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#bf4646', color: 'white', fontSize: '0.78rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none' }}>
  Find a Bhai <ArrowRight size={13} />
          </Link>
          <NotificationBell />
          <LogoutButton />
        </div>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Bookings</p>
          <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>My Bookings</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'white', padding: '0.4rem', borderRadius: '30px', border: '1px solid #eddcc6', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)} className={`tab ${filter === t ? 'active' : ''}`}>{t}</button>
          ))}
        </div>

        {loading ? (
          <p className="sans" style={{ color: '#aaa', fontSize: '0.875rem' }}>Loading...</p>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', border: '1px solid #eddcc6', borderRadius: '10px' }}>
            <Wrench size={32} color="#ddd" strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
            <p className="sans" style={{ fontSize: '0.875rem', color: '#bbb' }}>No {filter} bookings.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map(booking => {
              const sc = statusConfig[booking.status]
              return (
                <div key={booking.id} className="booking-card">
                  <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #eddcc6' }}>
                      {booking.workers?.photo_url
                        ? <img src={booking.workers.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: '#f5ede3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wrench size={18} color="#bf4646" strokeWidth={1.5} /></div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <p className="sans" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d2d2d' }}>{booking.workers?.profiles?.full_name}</p>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: sc.color, background: sc.bg, padding: '0.2rem 0.6rem', borderRadius: '20px', flexShrink: 0 }}>{sc.label}</span>
                      </div>
                      <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                        <MapPin size={11} /> {booking.workers?.district}
                      </p>
                      <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.75rem' }}>
                        <Calendar size={11} /> {new Date(booking.work_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>

                      {booking.status === 'approved' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#eef7f2', border: '1px solid #b8deca', padding: '0.6rem 0.875rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                          <Phone size={13} color="#4e8c6b" />
                          <p className="sans" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4e8c6b' }}>{booking.workers?.profiles?.phone}</p>
                        </div>
                      )}

                      <div style={{ background: '#fff4ea', padding: '0.75rem', borderRadius: '6px' }}>
                        <p className="sans" style={{ fontSize: '0.82rem', color: '#888', lineHeight: 1.6 }}>{booking.work_description}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
                        {canReview(booking) && (
                          <button className="action-btn" onClick={() => { setReviewModal(booking); setReviewForm({ rating: 0, description: '' }) }}
                            style={{ background: '#fff4ea', border: '1px solid #eddcc6', color: '#2d2d2d' }}>
                            <Star size={13} color="#bf4646" /> Leave Review
                          </button>
                        )}
                        {booking.reviews?.length > 0 && (
                          <span className="sans" style={{ fontSize: '0.75rem', color: '#bbb', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Star size={12} color="#bbb" /> Reviewed
                          </span>
                        )}
                        {booking.status === 'approved' && (
                          <button className="action-btn" onClick={() => setReportModal(booking)}
                            style={{ background: '#fdf0f0', border: '1px solid #f5c6c6', color: '#bf4646' }}>
                            <AlertTriangle size={13} /> Report
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReviewModal(null)}>
          <div className="modal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 className="serif" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2d2d2d' }}>Rate {reviewModal.workers?.profiles?.full_name}</h2>
              <button onClick={() => setReviewModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}><X size={18} color="#aaa" /></button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {[1,2,3,4,5].map(star => (
                <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                  <Star size={28} color="#bf4646" fill={star <= reviewForm.rating ? '#bf4646' : 'none'} strokeWidth={1.5} />
                </button>
              ))}
            </div>
            <textarea
              placeholder={reviewForm.rating > 0 && reviewForm.rating < 3 ? 'Description required for this rating...' : 'Add a description (optional, max 200 chars)...'}
              value={reviewForm.description}
              onChange={e => setReviewForm({ ...reviewForm, description: e.target.value })}
              maxLength={200} rows={3} className="textarea-field"
              style={{ marginBottom: '0.25rem' }}
            />
            <p className="sans" style={{ fontSize: '0.72rem', color: '#bbb', textAlign: 'right', marginBottom: '1rem' }}>{reviewForm.description.length}/200</p>
            {reviewError && <p className="sans" style={{ fontSize: '0.82rem', color: '#bf4646', marginBottom: '0.75rem' }}>{reviewError}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setReviewModal(null)} style={{ flex: 1, padding: '0.8rem', background: '#f5ede3', border: 'none', borderRadius: '6px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', color: '#888' }}>Cancel</button>
              <button onClick={handleReviewSubmit} disabled={reviewSubmitting}
                style={{ flex: 1, padding: '0.8rem', background: '#bf4646', border: 'none', borderRadius: '6px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', color: 'white', opacity: reviewSubmitting ? 0.6 : 1 }}>
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReportModal(null)}>
          <div className="modal">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 className="serif" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2d2d2d' }}>Report Issue</h2>
              <button onClick={() => { setReportModal(null); setReportReason('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}><X size={18} color="#aaa" /></button>
            </div>
            <p className="sans" style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Tell us what went wrong with {reportModal.workers?.profiles?.full_name}.</p>
            <textarea placeholder="e.g. Worker accepted but never showed up..." value={reportReason} onChange={e => setReportReason(e.target.value)} rows={4} className="textarea-field" style={{ marginBottom: '1rem' }} />
            {reportError && <p className="sans" style={{ fontSize: '0.82rem', color: '#bf4646', marginBottom: '0.75rem' }}>{reportError}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => { setReportModal(null); setReportReason('') }}
                style={{ flex: 1, padding: '0.8rem', background: '#f5ede3', border: 'none', borderRadius: '6px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', color: '#888' }}>Cancel</button>
              <button onClick={handleReportSubmit} disabled={reportSubmitting}
                style={{ flex: 1, padding: '0.8rem', background: '#bf4646', border: 'none', borderRadius: '6px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', color: 'white', opacity: reportSubmitting ? 0.6 : 1 }}>
                {reportSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
