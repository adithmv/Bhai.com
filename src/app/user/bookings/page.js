'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const fetchBookings = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        workers (
          photo_url,
          district,
          profiles (full_name, phone)
        ),
        reviews (id)
      `)
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return workDate <= today
  }

  const handleReviewSubmit = async () => {
    setReviewError('')
    if (reviewForm.rating === 0) { setReviewError('Please select a rating.'); return }
    if (reviewForm.rating < 3 && reviewForm.description.trim().length === 0) {
      setReviewError('Description is required for ratings below 3 stars.')
      return
    }
    if (reviewForm.description.length > 200) {
      setReviewError('Description must be under 200 characters.')
      return
    }

    setReviewSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('reviews').insert({
      booking_id: reviewModal.id,
      user_id: user.id,
      worker_id: reviewModal.worker_id,
      rating: reviewForm.rating,
      description: reviewForm.description || null,
    })

    if (error) { setReviewError(error.message); setReviewSubmitting(false); return }

    // update worker average rating
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('worker_id', reviewModal.worker_id)

    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    await supabase.from('workers').update({
      average_rating: Math.round(avg * 10) / 10,
      total_reviews: allReviews.length,
    }).eq('id', reviewModal.worker_id)

    setReviewModal(null)
    setReviewForm({ rating: 0, description: '' })
    setReviewSubmitting(false)
    fetchBookings()
  }
  const handleReportSubmit = async () => {
  setReportError('')
  if (reportReason.trim().length === 0) {
    setReportError('Please describe the issue.')
    return
  }
  setReportSubmitting(true)
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('reports').insert({
    booking_id: reportModal.id,
    user_id: user.id,
    worker_id: reportModal.worker_id,
    reason: reportReason,
  })

  if (error) { setReportError(error.message); setReportSubmitting(false); return }

  setReportModal(null)
  setReportReason('')
  setReportSubmitting(false)
  fetchBookings()
}

  const statusColors = {
    pending: 'text-yellow-400',
    approved: 'text-green-400',
    rejected: 'text-red-400',
    completed: 'text-blue-400',
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <a href="/user/dashboard" className="text-2xl font-bold text-orange-500">bhai.com</a>
        <a href="/user/browse" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          Find a Bhai
        </a>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-6">My Bookings</h1>

        <div className="flex gap-3 mb-6 flex-wrap">
          {['pending', 'approved', 'rejected', 'completed'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                filter === s ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-400">No {filter} bookings.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-gray-900 rounded-2xl p-6">
                <div className="flex gap-4 items-start">
                  <img
                    src={booking.workers?.photo_url}
                    alt={booking.workers?.profiles?.full_name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-lg">{booking.workers?.profiles?.full_name}</h2>
                    <p className="text-gray-400 text-sm">📍 {booking.workers?.district}</p>
                    <p className="text-gray-400 text-sm">📅 {new Date(booking.work_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

                    {/* Phone revealed only after approval */}
                    {booking.status === 'approved' && (
                      <p className="text-green-400 text-sm font-medium mt-1">
                        📞 {booking.workers?.profiles?.phone}
                      </p>
                    )}

                    <div className="bg-gray-800 rounded-xl p-3 mt-3">
                      <p className="text-gray-300 text-sm">{booking.work_description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-sm font-semibold capitalize ${statusColors[booking.status]}`}>
                        {booking.status === 'pending' && '⏳ Waiting for response'}
                        {booking.status === 'approved' && '✅ Approved'}
                        {booking.status === 'rejected' && '❌ Rejected'}
                        {booking.status === 'completed' && '🏁 Completed'}
                      </span>

                      {canReview(booking) && (
                        <button
                          onClick={() => { setReviewModal(booking); setReviewForm({ rating: 0, description: '' }) }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                          Leave Review
                        </button>
                      )}

                      {booking.reviews?.length > 0 && (
                        <span className="text-gray-500 text-sm">✍️ Reviewed</span>
                      )}

                    {booking.status === 'approved' && (
                      <button
                        onClick={() => setReportModal(booking)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition ml-2"
                     >
                        Report
                      </button>
)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center px-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">Rate {reviewModal.workers?.profiles?.full_name}</h2>
            <p className="text-gray-400 text-sm mb-6">How was the work?</p>

            {/* Stars */}
            <div className="flex gap-3 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className={`text-4xl transition ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder={reviewForm.rating > 0 && reviewForm.rating < 3
                ? 'Description is required for this rating...'
                : 'Add a description (optional, max 200 chars)...'}
              value={reviewForm.description}
              onChange={(e) => setReviewForm({ ...reviewForm, description: e.target.value })}
              maxLength={200}
              rows={3}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none placeholder-gray-500 resize-none mb-1"
            />
            <p className="text-gray-500 text-xs text-right mb-4">{reviewForm.description.length}/200</p>

            {reviewError && <p className="text-red-400 text-sm mb-3">{reviewError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setReviewModal(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={reviewSubmitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition"
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
{/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center px-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">Report {reportModal.workers?.profiles?.full_name}</h2>
            <p className="text-gray-400 text-sm mb-6">Tell us what went wrong.</p>

            <textarea
              placeholder="e.g. Worker accepted but never showed up..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none placeholder-gray-500 resize-none mb-4"
            />

            {reportError && <p className="text-red-400 text-sm mb-3">{reportError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setReportModal(null); setReportReason('') }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={reportSubmitting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition"
              >
                {reportSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
