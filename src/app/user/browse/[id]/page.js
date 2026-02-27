'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function BookingPage() {
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    work_description: '',
    work_date: '',
  })

  const supabase = createClient()
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchWorker = async () => {
      const { data } = await supabase
        .from('workers')
        .select(`
          *,
          profiles (full_name),
          worker_skills (skill, category),
          worker_towns (town)
        `)
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    // check worker is not already booked on that date
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

    if (bookingError) {
      setError(bookingError.message)
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  // min date is today
  const today = new Date().toISOString().split('T')[0]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Worker not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <a href="/user/browse" className="text-2xl font-bold text-orange-500">bhai.com</a>
        <a href="/user/bookings" className="text-gray-300 hover:text-orange-400 transition text-sm">My Bookings</a>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10">

        {success ? (
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Request Sent!</h2>
            <p className="text-gray-400 mb-6">
              Your booking request has been sent to {worker.profiles?.full_name}.
              You will be notified once they approve or reject it.
            </p>
            <div className="flex gap-3">
              
                href="/user/bookings"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition text-center"
              >
                View My Bookings
              </a>
              
                href="/user/browse"
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition text-center"
              >
                Browse More
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Worker Card */}
            <div className="bg-gray-900 rounded-2xl p-6 mb-6 flex gap-4 items-center">
              <img
                src={worker.photo_url}
                alt={worker.profiles?.full_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 flex-shrink-0"
              />
              <div>
                <h2 className="text-white text-lg font-bold">{worker.profiles?.full_name}</h2>
                <p className="text-gray-400 text-sm">📍 {worker.district}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {worker.worker_skills?.map(s => (
                    <span key={s.skill} className="bg-orange-500 bg-opacity-20 text-orange-300 text-xs px-2 py-1 rounded-full">
                      {s.skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Book this Bhai</h1>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Work Date *</label>
                  <input
                    type="date"
                    value={form.work_date}
                    onChange={(e) => setForm({ ...form, work_date: e.target.value })}
                    min={today}
                    required
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Describe the Work *</label>
                  <textarea
                    placeholder="e.g. Need to fix a leaking pipe under the kitchen sink and replace the tap..."
                    value={form.work_description}
                    onChange={(e) => setForm({ ...form, work_description: e.target.value })}
                    rows={4}
                    required
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none placeholder-gray-500 resize-none"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
                >
                  {submitting ? 'Sending Request...' : 'Send Booking Request'}
                </button>

              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
