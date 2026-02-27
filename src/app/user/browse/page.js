'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const KERALA_CITIES = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
]

const ALL_SKILLS = [
  'Electrician', 'Plumber', 'Carpenter (Ashari)', 'Mason (Mestri)', 'Painter',
  'Material Shifting', 'Earthwork / Digging', 'Land Clearing', 'Construction Debris Removal',
  'Coconut Climber (Thenga Kayattam)', 'Grass / Bush Cutting', 'Well Maintenance', 'Event Helper / Cook',
  'AC & Fridge Technician', 'Inverter / Solar Fixer', 'CCTV & Wi-Fi Setup', 'Washing Machine / Oven Repair',
  'Welder', 'Gardener', 'Two-Wheeler / Car Mechanic', 'Small Load Pickup (Tempo)',
]

export default function BrowsePage() {
  const [city, setCity] = useState('')
  const [skill, setSkill] = useState('')
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const fetchWorkers = async () => {
    if (!city) return
    setLoading(true)
    setSearched(true)

    let query = supabase
      .from('workers')
      .select(`
        *,
        profiles (full_name),
        worker_skills (skill, category)
      `)
      .eq('status', 'approved')
      .eq('city', city)

    const { data } = await query
    let results = data || []

    if (skill) {
      results = results.filter(w =>
        w.worker_skills?.some(s => s.skill === skill)
      )
    }

    setWorkers(results)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <a href="/user/dashboard" className="text-2xl font-bold text-orange-500">bhai.com</a>
        <a href="/user/bookings" className="text-gray-300 hover:text-orange-400 transition text-sm">My Bookings</a>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Find a Bhai</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-gray-800 text-white rounded-xl px-4 py-3 outline-none flex-1 min-w-48"
          >
            <option value="">Select City *</option>
            {KERALA_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="bg-gray-800 text-white rounded-xl px-4 py-3 outline-none flex-1 min-w-48"
          >
            <option value="">All Skills (optional)</option>
            {ALL_SKILLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={fetchWorkers}
            disabled={!city}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Search
          </button>
        </div>

        {/* Results */}
        {loading && <p className="text-gray-400">Searching...</p>}

        {!loading && searched && workers.length === 0 && (
          <p className="text-gray-400">No Bhais found in this area. Try a different city or skill.</p>
        )}

        {!loading && workers.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-gray-900 rounded-2xl p-6 flex gap-5 items-center"
              >
                <img
                  src={worker.photo_url}
                  alt={worker.profiles?.full_name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 flex-shrink-0"
                />

                <div className="flex-1">
                  <h2 className="text-white text-xl font-bold">{worker.profiles?.full_name}</h2>
                  <p className="text-gray-400 text-sm mb-2">📍 {worker.city}</p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {worker.worker_skills?.map((s) => (
                      <span key={s.skill} className="bg-orange-500 bg-opacity-20 text-orange-300 text-xs px-2 py-1 rounded-full">
                        {s.skill}
                      </span>
                    ))}
                  </div>

                  {worker.average_rating > 0 && (
                    <p className="text-yellow-400 text-sm">⭐ {worker.average_rating} / 5</p>
                  )}

                  {worker.bio && (
                    <p className="text-gray-500 text-sm italic mt-1">"{worker.bio}"</p>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/user/browse/${worker.id}`)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl transition"
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}