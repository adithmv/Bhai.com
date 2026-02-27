'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      const { data: workerData } = await supabase
        .from('workers')
        .select('status')
        .eq('id', user.id)
        .single()
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
      .select('*, profiles (full_name, phone)')
      .eq('worker_id', user.id)
      .eq('status', filter)
      .order('work_date', { ascending: true })

    setBookings(data || [])
  }

  const updateBooking = async (id, status) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings()
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-orange-500">bhai.com</h1>
        <p className="text-gray-400 text-sm">Welcome, {profile?.full_name?.split(' ')[0]} 👷</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Pending approval state */}
        {workerStatus === 'pending' && (
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-2">Profile Under Review</h2>
            <p className="text-gray-400">Your profile is being reviewed by our admin. We will notify you once approved.</p>
          </div>
        )}

        {workerStatus === 'rejected' && (
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-2">Profile Rejected</h2>
            <p className="text-gray-400">Your profile was not approved. Please contact support for more information.</p>
          </div>
        )}

        {workerStatus === 'banned' && (
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Banned</h2>
            <p className="text-gray-400">Your account has been banned. Please contact support.</p>
          </div>
        )}

        {workerStatus === 'approved' && (
          <>
            <h1 className="text-3xl font-bold text-white mb-6">My Bookings</h1>

            {/* Filter Tabs */}
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

            {bookings.length === 0 ? (
              <p className="text-gray-400">No {filter} bookings.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="bg-gray-900 rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-white font-bold text-lg mb-1">{booking.profiles?.full_name}</h2>
                        <p className="text-gray-400 text-sm mb-1">📅 {new Date(booking.work_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

                        {/* Show phone only if approved */}
                        {booking.status === 'approved' && (
                          <p className="text-orange-400 text-sm font-medium mb-2">📞 {booking.profiles?.phone}</p>
                        )}

                        <div className="bg-gray-800 rounded-xl p-3 mt-2">
                          <p className="text-gray-300 text-sm">{booking.work_description}</p>
                        </div>
                      </div>

                      {filter === 'pending' && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => updateBooking(booking.id, 'approved')}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateBooking(booking.id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {filter === 'approved' && (
                        <button
                          onClick={() => updateBooking(booking.id, 'completed')}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition flex-shrink-0"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
