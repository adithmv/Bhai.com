'use client'
import { getUserFromStorage } from '@/lib/getUser'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, MapPin, Star, Calendar, FileText, CheckCircle, ArrowRight, Wrench } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from '@/components/shared/LogoutButton'

export default function BookingPage() {
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ work_description: '', work_date: '' })

  const supabase = createClient()
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchWorker = async () => {
      const { data } = await supabase
        .from('workers')
        .select('*, profiles(full_name), worker_skills(skill, category), worker_towns(town)')
        .eq('id', id)
        .single()
      setWorker(data)
      setLoading(false)
    }
    fetchWorker()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    

const user = getUserFromStorage()
if (!user) { router.push('/auth/login'); return }

    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('worker_id', id)
      .eq('work_date', form.work_date)
      .eq('status', 'approved')
      .single()

    if (existingBooking) {
      setError('This Bhai is already booked on that date. Please choose another date.')
      setSubmitting(false)
      return
    }

    const { error: bookingError } = await supabase.from('bookings').insert({
      user_id: user.id,
      worker_id: id,
      work_description: form.work_description,
      work_date: form.work_date,
    })

    if (bookingError) { setError(bookingError.message); setSubmitting(false); return }
    setSuccess(true)
    setSubmitting(false)
  }

  const today = new Date().toISOString().split('T')[0]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans' }}>
      <p style={{ color: '#aaa' }}>Loading...</p>
    </div>
  )

  if (!worker) return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans' }}>
      <p style={{ color: '#aaa' }}>Worker not found.</p>
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
        .card { background: white; border: 1px solid #eddcc6; border-radius: 10px; }
        .input-field {
          width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem;
          background: #fff4ea; border: 1.5px solid #eddcc6;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: #2d2d2d; outline: none; transition: border-color 0.2s;
          border-radius: 6px;
        }
        .input-field:focus { border-color: #bf4646; }
        .textarea-field {
          width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem;
          background: #fff4ea; border: 1.5px solid #eddcc6;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
          color: #2d2d2d; outline: none; transition: border-color 0.2s;
          border-radius: 6px; resize: none;
        }
        .textarea-field:focus { border-color: #bf4646; }
        .textarea-field::placeholder { color: #bbb; }
        .submit-btn {
          width: 100%; padding: 0.9rem;
          background: #bf4646; color: white; border: none;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          border-radius: 6px;
        }
        .submit-btn:hover:not(:disabled) { background: #a83c3c; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .skill-tag { background: #fdf5f5; color: #bf4646; border: 1px solid #f0d5d5; font-size: 0.72rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 20px; }
        .town-tag { background: #f0f7f8; color: #7eacb5; font-size: 0.72rem; padding: 0.25rem 0.5rem; border-radius: 20px; }
      `}</style>

      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '0.25rem' }}>
            <ChevronLeft size={20} />
          </button>
          <Image src="/logo.png" alt="Bhai.com" width={80} height={26} style={{ objectFit: 'contain' }} />
        </div>
        <LogoutButton />
      </nav>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 1rem' }}>

        {success ? (
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#eef7f2', border: '1px solid #b8deca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={28} color="#4e8c6b" strokeWidth={1.5} />
            </div>
            <h2 className="serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2d2d2d', marginBottom: '0.75rem' }}>Request Sent!</h2>
            <p className="sans" style={{ fontSize: '0.875rem', color: '#aaa', lineHeight: 1.7, marginBottom: '2rem' }}>
              Your booking request has been sent to {worker.profiles?.full_name}. You will be notified once they respond.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="/user/bookings" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: '#bf4646', color: 'white', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', padding: '0.8rem', borderRadius: '6px', textDecoration: 'none' }}>
                My Bookings <ArrowRight size={14} />
              </a>
              <Link href="/user/browse" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff4ea', border: '1px solid #eddcc6', color: '#888', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', padding: '0.8rem', borderRadius: '6px', textDecoration: 'none' }}>
                Browse More
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Worker card */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <img src={worker.photo_url} alt={worker.profiles?.full_name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eddcc6', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <p className="sans" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d2d2d' }}>{worker.profiles?.full_name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
  {worker.average_rating > 0 ? (
    <>
      <Star size={12} color="#bf4646" fill="#bf4646" />
      <span className="sans" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d2d' }}>{worker.average_rating}</span>
      <span className="sans" style={{ fontSize: '0.72rem', color: '#aaa' }}>({worker.total_reviews})</span>
    </>
  ) : (
    <span className="sans" style={{ fontSize: '0.72rem', color: '#bbb' }}>No reviews</span>
  )}
</div>
                </div>
                <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.6rem' }}>
                  <MapPin size={11} /> {worker.district}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  {worker.worker_skills?.map(s => <span key={s.skill} className="skill-tag">{s.skill}</span>)}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {worker.worker_towns?.slice(0, 3).map(t => <span key={t.town} className="town-tag">{t.town}</span>)}
                  {worker.worker_towns?.length > 3 && <span className="town-tag">+{worker.worker_towns.length - 3} more</span>}
                </div>
                {worker.bio && <p className="sans" style={{ fontSize: '0.75rem', color: '#bbb', marginTop: '0.5rem', fontStyle: 'italic' }}>&quot;{worker.bio}&quot;</p>}
              </div>
            </div>

            {/* Booking form */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Booking</p>
                <h1 className="serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2d2d2d' }}>Book this Bhai</h1>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div>
                  <label className="sans" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#888', display: 'block', marginBottom: '0.5rem' }}>Work Date *</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} color="#bbb" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input type="date" value={form.work_date} onChange={e => setForm({ ...form, work_date: e.target.value })} min={today} required className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="sans" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#888', display: 'block', marginBottom: '0.5rem' }}>Describe the Work *</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} color="#bbb" style={{ position: 'absolute', left: '0.9rem', top: '0.9rem', pointerEvents: 'none' }} />
                    <textarea
                      placeholder="e.g. Need to fix a leaking pipe under the kitchen sink and replace the tap..."
                      value={form.work_description}
                      onChange={e => setForm({ ...form, work_description: e.target.value })}
                      rows={4} required className="textarea-field"
                    />
                  </div>
                </div>

                {error && (
                  <div style={{ background: '#fdf0f0', border: '1px solid #f5c6c6', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                    <p className="sans" style={{ fontSize: '0.82rem', color: '#bf4646' }}>{error}</p>
                  </div>
                )}

                <div style={{ background: '#fff4ea', border: '1px solid #eddcc6', padding: '0.875rem', borderRadius: '6px' }}>
                  <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', lineHeight: 1.6 }}>
                    After the Bhai accepts your request, their phone number will be revealed so you can coordinate directly. Payment is done in cash after the work is complete.
                  </p>
                </div>

                <button type="submit" disabled={submitting} className="submit-btn">
                  {submitting ? 'Sending Request...' : <><span>Send Booking Request</span><ArrowRight size={16} /></>}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
