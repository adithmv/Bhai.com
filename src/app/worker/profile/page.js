'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const CATEGORIES = {
  'Essential Home Repairs': [
    'Electrician',
    'Plumber',
    'Carpenter (Ashari)',
    'Mason (Mestri)',
    'Painter',
  ],
  'Heavy Work & Labour': [
    'Material Shifting',
    'Earthwork / Digging',
    'Land Clearing',
    'Construction Debris Removal',
  ],
  'Kerala Specialty Services': [
    'Coconut Climber (Thenga Kayattam)',
    'Grass / Bush Cutting',
    'Well Maintenance',
    'Event Helper / Cook',
  ],
  'Machine & Tech Support': [
    'AC & Fridge Technician',
    'Inverter / Solar Fixer',
    'CCTV & Wi-Fi Setup',
    'Washing Machine / Oven Repair',
  ],
  'Outdoor & Transportation': [
    'Welder',
    'Gardener',
    'Two-Wheeler / Car Mechanic',
    'Small Load Pickup (Tempo)',
  ],
}

const KERALA_CITIES = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
]

export default function WorkerProfileSetup() {
  const [form, setForm] = useState({
    city: '',
    bio: '',
  })
  const [selectedSkills, setSelectedSkills] = useState([])
  const [activeCategory, setActiveCategory] = useState(Object.keys(CATEGORIES)[0])
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const toggleSkill = (category, skill) => {
    const exists = selectedSkills.find(s => s.skill === skill && s.category === category)
    if (exists) {
      setSelectedSkills(selectedSkills.filter(s => !(s.skill === skill && s.category === category)))
    } else {
      setSelectedSkills([...selectedSkills, { category, skill }])
    }
  }

  const isSelected = (category, skill) =>
    !!selectedSkills.find(s => s.skill === skill && s.category === category)

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

    if (selectedSkills.length === 0) {
      setError('Please select at least one skill.')
      setLoading(false)
      return
    }

    if (!photo) {
      setError('Please upload a profile photo.')
      setLoading(false)
      return
    }

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
      city: form.city,
      bio: form.bio,
      photo_url,
    })

    if (workerError) {
      setError(workerError.message)
      setLoading(false)
      return
    }

    // insert skills
    const skillsToInsert = selectedSkills.map(s => ({
      worker_id: user.id,
      category: s.category,
      skill: s.skill,
    }))

    const { error: skillsError } = await supabase
      .from('worker_skills')
      .insert(skillsToInsert)

    if (skillsError) {
      setError(skillsError.message)
      setLoading(false)
      return
    }

    router.push('/worker/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-1">Set Up Your Profile</h1>
        <p className="text-gray-400 mb-8">Tell us about yourself to get approved on bhai.com</p>

        <form onSubmit={handleSubmit} className="space-y-6">

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
              />
            </label>
          </div>

          {/* City */}
          <select
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
          >
            <option value="">Select Your City</option>
            {KERALA_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Skills */}
          <div>
            <p className="text-white font-semibold mb-3">Select Your Skills *</p>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    activeCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES[activeCategory].map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(activeCategory, skill)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition text-left ${
                    isSelected(activeCategory, skill)
                      ? 'bg-orange-500 text-white'