'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const CATEGORIES = {
  'Essential Bhais': [
    'Electrician (Wireman)',
    'Plumber',
    'Carpenter',
    'Mestri (Mason)',
    'Painter',
  ],
  'Kerala Specials': [
    'Coconut Climber (Thenga Kayattam)',
    'Well Cleaner (Kinar Panikkaran)',
    'Brush Cutter / Grass Cutter',
    'Catering Help / Small Event Cook',
    'Coconut Husk/Tree Removal',
  ],
  'Appliance & Electronics': [
    'AC Mechanic',
    'Inverter / Solar Tech',
    'CCTV Technician',
    'Laptop/Mobile Service',
    'Fridge/Washing Machine Tech',
  ],
  'Outdoor & Heavy Duty': [
    'Welder',
    'Automotive (Two-Wheeler/Car)',
    'Logistics (Tempo/Pickup)',
    'Septic Tank Cleaning',
  ],
  'Cleaning & Home Care': [
    'Deep Cleaning',
    'Pest Control',
    'Gardener/Landscaper',
  ],
}

const KERALA_CITIES = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
]

export default function WorkerProfileSetup() {
  const [form, setForm] = useState({
    category: '',
    skill: '',
    city: '',
    bio: '',
  })
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    // upload photo
    const fileExt = photo.name.split('.').pop()
    const fileName = `${user.id}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('worker-photos')
      .upload(fileName, photo, { upsert: true })

    if (uploadError) {
      setError('Photo upload failed. Try again.')
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('worker-photos')
      .getPublicUrl(fileName)

    const photo_url = urlData.publicUrl

    // insert worker record
    const { error: workerError } = await supabase.from('workers').insert({
      id: user.id,
      skill: form.skill,
      category: form.category,
      city: form.city,
      bio: form.bio,
      photo_url,
    })

    if (workerError) {
      setError(workerError.message)
      setLoading(false)
      return
    }

    router.push('/worker/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-1">Set Up Your Profile</h1>
        <p className="text-gray-400 mb-8">Fill in your details to get started on bhai.com</p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Photo Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden border-2 border-orange-500">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  Photo
                </div>
              )}
            </div>
            <label className="cursor-pointer text-orange-400 hover:underline text-sm">
              Upload Profile Photo *
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                required
              />
            </label>
          </div>

          {/* Category */}
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value, skill: '' })}
            required
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
          >
            <option value="">Select Category</option>
            {Object.keys(CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Skill */}
          {form.category && (
            <select
              value={form.skill}
              onChange={(e) => setForm({ ...form, skill: e.target.value })}
              required
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
            >
              <option value="">Select Skill</option>
              {CATEGORIES[form.category].map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          )}

          {/* City */}
          <select
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
          >
            <option value="">Select City</option>
            {KERALA_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Bio */}
          <textarea
            placeholder="Short bio — describe your experience (optional)"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none placeholder-gray-500 resize-none"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !photo}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  )
}