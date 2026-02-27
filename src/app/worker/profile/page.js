'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const CATEGORIES = {
  'Essential Home Repairs': [
    { skill: 'Electrician', desc: 'Fixing lights, fans, faulty switches, or motor/pump issues.' },
    { skill: 'Plumber', desc: 'Fixing leaking taps, blocked pipes, tank cleaning, and bathroom fittings.' },
    { skill: 'Carpenter (Ashari)', desc: 'Repairing wooden doors, windows, locks, and furniture.' },
    { skill: 'Mason (Mestri)', desc: 'Tiling, granite work, wall plastering, and minor cement repairs.' },
    { skill: 'Painter', desc: 'Interior/exterior wall painting, metal polishing, and waterproofing.' },
  ],
  'Heavy Work & Labour': [
    { skill: 'Material Shifting', desc: 'Moving sand, bricks, laterite stones (Vettu Kallu), or cement to the work site.' },
    { skill: 'Earthwork / Digging', desc: 'Digging for foundations, septic tanks, or water pipe trenches.' },
    { skill: 'Land Clearing', desc: 'Leveling uneven ground or removing soil and rocks from the yard.' },
    { skill: 'Construction Debris Removal', desc: 'Clearing away waste materials after a renovation.' },
  ],
  'Kerala Specialty Services': [
    { skill: 'Coconut Climber (Thenga Kayattam)', desc: 'Climbing and cleaning coconut trees or harvesting.' },
    { skill: 'Grass / Bush Cutting', desc: 'Clearing overgrown grass and weeds using a brush cutter.' },
    { skill: 'Well Maintenance', desc: 'Deep cleaning the house well and fixing motor issues.' },
    { skill: 'Event Helper / Cook', desc: 'Assisting with food prep (Sadhya/Biryani) or cleaning for home functions.' },
  ],
  'Machine & Tech Support': [
    { skill: 'AC & Fridge Technician', desc: 'Servicing, gas filling, and cooling repairs.' },
    { skill: 'Inverter / Solar Fixer', desc: 'Maintaining power backups and solar water heaters.' },
    { skill: 'CCTV & Wi-Fi Setup', desc: 'Installing security cameras or fixing internet range issues.' },
    { skill: 'Washing Machine / Oven Repair', desc: 'Fixing common household appliances.' },
  ],
  'Outdoor & Transportation': [
    { skill: 'Welder', desc: 'Fixing iron gates, grills, or any metal fabrication.' },
    { skill: 'Gardener', desc: 'Planting, pruning, and maintaining the garden or lawn.' },
    { skill: 'Two-Wheeler / Car Mechanic', desc: 'Basic doorstep service like oil changes or puncture repair.' },
    { skill: 'Small Load Pickup (Tempo)', desc: 'Transporting heavy items like a fridge, cupboard, or a few bags of cement.' },
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

  const [hoveredSkill, setHoveredSkill] = useState(null)


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
                // eslint-disable-next-line @next/next/no-img-element
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
  {CATEGORIES[activeCategory].map(({ skill, desc }) => (
    <div key={skill} className="relative">
      <button
        type="button"
        onClick={() => toggleSkill(activeCategory, skill)}
        onMouseEnter={() => setHoveredSkill(skill)}
        onMouseLeave={() => setHoveredSkill(null)}
        className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition text-left ${
          isSelected(activeCategory, skill)
            ? 'bg-orange-500 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        {skill}
      </button>
      {hoveredSkill === skill && (
        <div className="absolute z-10 bottom-full mb-2 left-0 w-56 bg-gray-700 text-gray-200 text-xs rounded-xl p-3 shadow-lg">
          {desc}
        </div>
      )}
    </div>
  ))}
</div>

            {/* Selected Skills Summary */}
            {selectedSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSkills.map((s) => (
                  <span
                    key={`${s.category}-${s.skill}`}
                    className="bg-orange-500 bg-opacity-20 text-orange-300 text-xs px-2 py-1 rounded-full"
                  >
                    {s.skill}
                  </span>
                ))}
              </div>
            )}
          </div>

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
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  )
}