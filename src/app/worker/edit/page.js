'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Camera, Search, CheckCircle, ArrowLeft, Save, Loader } from 'lucide-react'

const DISTRICTS_AND_TOWNS = {
  'Thiruvananthapuram': ['Thiruvananthapuram','Neyyattinkara','Nedumangad','Attingal','Varkala','Alamcode','Andoorkonam','Athiyannur','Azhoor','Balaramapuram','Edakkode','Iroopara','Kadakkavoor','Kadinamkulam','Kalliyoor','Kanjiramkulam','Karakulam','Keezhattingal','Kudappanakkunnu','Kulathummal','Malayinkeezhu','Menamkulam','Pallichal','Pallippuram','Parassala','Parasuvaikkal','Vakkom','Vattappara','Veiloor','Venganoor','Vilappil','Vilavoorkkal'],
  'Kollam': ['Kollam','Punalur','Karunagappally','Paravur','Kottarakkara','Adichanalloor','Adinad','Ayanivelikulangara','Chavara','Elampalloor','Kallelibhagom','Kottamkara','Kulasekharapuram','Mayyanad','Meenad','Nedumpana','Oachira','Panayam','Panmana','Perinad','Poothakkulam','Thazhuthala','Thodiyoor','Thrikkadavoor','Thrikkaruva','Thrikkovilvattom','Vadakkumthala'],
  'Pathanamthitta': ['Thiruvalla','Pathanamthitta','Adoor','Pandalam','Kozhenchery'],
  'Alappuzha': ['Alappuzha','Kayamkulam','Cherthala','Mavelikkara','Chengannur','Haripad','Arookutty','Aroor','Bharanikkavu','Chennithala','Cheppad','Chingoli','Ezhupunna','Kandalloor','Kanjikkuzhi','Kannamangalam','Karthikappally','Kattanam','Keerikkad','Kodamthuruth','Kokkothamangalam','Komalapuram','Krishnapuram','Kumarapuram','Kurattissery','Kuthiathode','Mannanchery','Mannar','Muhamma','Muthukulam','Pallippuram','Pathirappally','Pathiyoor','Puthuppally','Thaikattussery','Thanneermukkam','Thazhakara','Vayalar'],
  'Kottayam': ['Kottayam','Changanassery','Pala','Vaikom','Ettumanoor','Erattupetta','Aimanam','Athirampuzha','Chengalam South','Chethipuzha','Nattakam','Paippad','Panachikkad','Perumbaikad','Puthuppally','Thrikkodithanam','Vijayapuram'],
  'Idukki': ['Thodupuzha','Kattappana','Munnar','Adimali','Painavu'],
  'Ernakulam': ['Kochi','Thrippunithura','Kalamassery','Thrikkakara','Maradu','Kothamangalam','Angamaly','North Paravur','Muvattupuzha','Perumbavoor','Piravom','Eloor','Aluva','Koothattukulam','Alangad','Amballur','Chelamattom','Chendamangalam','Chengamanad','Cheranallur','Choornikkara','Chowwara','Edathala','Elamkunnapuzha','Eramalloor','Kadamakkudy','Kadungalloor','Kakkanad','Kalady','Kanayannur','Karumalloor','Kizhakkumbhagom','Koovappady','Kottuvally','Kumbalam','Kumbalangy','Kunnathunad','Kureekkad','Manakunnam','Marampilly','Mattoor','Moothakunnam','Mulamthuruthy','Mulavukad','Nedumbassery','Njarackal','Puthencruz','Puthenvelikkara','Puthuvype','Thekkumbhagom','Thiruvankulam','Vadakkekara','Vadakkumbhagom','Varappuzha','Vazhakkala','Vazhakulam','Velloorkunnam','Vengola'],
  'Thrissur': ['Thrissur','Kodungallur','Kunnamkulam','Chalakudy','Chavakkad','Irinjalakuda','Guruvayur','Wadakkanchery','Adat','Akathiyoor','Ala','Alur','Amballur','Anjur','Anthicad','Avanur','Avinissery','Brahmakulam','Chelakkara','Chendrappini','Cherpu','Cheruthuruthy','Chevvoor','Chiramanangad','Chiranellur','Chittanda','Chittilappilly','Choolissery','Choondal','Desamangalam','Edakkalathur','Edakkazhiyur','Edathirinji','Edathiruthy','Edavilangu','Elavally','Enkakkad','Eranellur','Eravu','Eyyal','Iringaprom','Kadavallur','Kadikkad','Kainoor','Kaipamangalam','Kaiparamba','Kallettumkara','Kallur','Killannur','Kolazhy','Koratty','Kottappuram'],
  'Palakkad': ['Palakkad','Ottappalam','Shoranur','Chittur','Pattambi','Cherpulassery','Mannarkkad','Alathur','Hemambikanagar','Koduvayur','Marutharode','Muthuthala','Ongallur','Pirayiri','Pudussery Central','Pudussery West','Puthunagaram','Puthuppariyaram','Thrithala','Vaniyamkulam'],
  'Malappuram': ['Manjeri','Ponnani','Parappanangadi','Tanur','Malappuram','Kondotty','Tirurangadi','Tirur','Perinthalmanna','Nilambur','Kottakkal','Valanchery','Abdu Rahiman Nagar','Aikkarappadi','Alamcode','Ariyallur','Chelambra','Cherukavu','Cheriyamundam','Edappal','Irimbiliyam','Kalady','Kannamangalam','Kattipparuthi','Koottilangadi','Kodur','Kuttippuram','Marancheri','Moonniyur','Naduvattom','Nannambra','Neduva','Othukkungal','Ourakam','Pallikkal','Parappur','Perumanna','Peruvallur','Ponmundam','Talakkad','Tanalur','Thennala','Thenhippalam','Thirunavaya','Triprangode','Urakam','Vazhayur','Vengara'],
  'Kozhikode': ['Kozhikode','Vatakara','Koyilandy','Feroke','Payyoli','Koduvally','Mukkam','Ramanattukara','Atholi','Ayancheri','Azhiyur','Balusseri','Beypore','Chekkiad','Chelannur','Chemancheri','Cheruvannur','Chorode','Edacheri','Eramala','Eravattur','Iringal','Kakkodi','Karuvanthuruthy','Keezhariyur','Koothali','Kottappally','Kozhukkallur','Kunnamangalam','Kunnummal','Kuruvattur','Kuttikkattoor','Maniyur','Mavoor','Meppayyur','Nadapuram','Naduvannur','Nanmanda','Olavanna','Palayad','Panangad','Pantheeramkavu','Perumanna','Peruvayal','Poolacode','Thalakkulathur','Thazhecode','Thikkody','Thuneri','Thurayur','Ulliyeri','Valayam','Villiappally'],
  'Wayanad': ['Kalpetta','Mananthavady','Sulthan Bathery'],
  'Kannur': ['Kannur','Thalassery','Payyannur','Taliparamba','Mattannur','Koothuparamba','Anthoor','Panoor','Iritty','Sreekandapuram','Ancharakandy','Azhikode North','Azhikode South','Chala','Cheleri','Chelora','Cherukunnu','Cheruthazham','Chirakkal','Chockli','Dharmadom','Elayavoor','Eranholi','Eruvatti','Ezhome','Irikkur','Iriveri','Kadachira','Kadannappalli','Kadirur','Kalliasseri','Kandamkunnu','Kanhirode','Kannadiparamba','Kannapuram','Karivellur','Keezhallur','Kolacherry','Kolavelloor','Koodali','Kottayam-Malabar','Kunhimangalam','Kurumathur','Kuttiattoor','Madayi','Manantheri','Mangattidam','Maniyoor','Mavilayi','Mayyil','Mokeri','Munderi','Muzhappilangad','Narath','New Mahe','Paduvilayi','Pallikkunnu','Panniyannur','Pappinisseri','Pariyaram','Pathiriyad','Pattiom','Peralassery','Peringathur','Pinarayi','Puzhathi','Thottada','Valapattanam','Varam'],
  'Kasaragod': ['Kasaragod','Kanhangad','Nileshwaram','Ajanur','Bangra Manjeshwar','Bare','Chemnad','Chengala','Hosabettu','Keekan','Koipady','Kudlu','Kunjathur','Madhur','Mangalpady','Maniyat','Manjeshwar','Mogral','North Thrikkaripur','Pallikkara','Perole','Pilicode','Puthur','Shiribagilu','Shiriya','South Thrikkaripur','Udma','Uppala'],
}

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
    { skill: 'Welder', desc: 'Gate, railing, and metal fabrication work.' },
    { skill: 'Gardener', desc: 'Plant care, pruning, and garden landscaping.' },
    { skill: 'Two-Wheeler / Car Mechanic', desc: 'On-site minor repairs, battery, tyre, and maintenance.' },
    { skill: 'Small Load Pickup (Tempo)', desc: 'Transporting small household goods or materials.' },
  ],
}

export default function WorkerEditProfile() {
  const supabase = createClient()
  const router = useRouter()
  const fileRef = useRef()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [photoUrl, setPhotoUrl] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [district, setDistrict] = useState('')
  const [townSearch, setTownSearch] = useState('')
  const [selectedTowns, setSelectedTowns] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [activeCategory, setActiveCategory] = useState(Object.keys(CATEGORIES)[0])
  const [bio, setBio] = useState('')
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: workerData } = await supabase.from('workers').select('*').eq('id', user.id).single()
      if (!workerData) { router.push('/worker/dashboard'); return }

      setPhotoUrl(workerData.photo_url || '')
      setPhotoPreview(workerData.photo_url || '')
      setDistrict(workerData.district || '')
      setBio(workerData.bio || '')

      const { data: townsData } = await supabase.from('worker_towns').select('town').eq('worker_id', user.id)
      setSelectedTowns(townsData?.map(t => t.town) || [])

      const { data: skillsData } = await supabase.from('worker_skills').select('skill').eq('worker_id', user.id)
      setSelectedSkills(skillsData?.map(s => s.skill) || [])

      setLoading(false)
    }
    load()
  }, [])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const towns = district
    ? (DISTRICTS_AND_TOWNS[district] || []).filter(t =>
        t.toLowerCase().includes(townSearch.toLowerCase())
      )
    : []

  const toggleTown = (t) =>
    setSelectedTowns(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  const toggleSkill = (skill) =>
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(x => x !== skill) : [...prev, skill])

  const handleSave = async () => {
    if (!district || selectedTowns.length === 0 || selectedSkills.length === 0) {
      alert('Please fill in district, at least one town, and at least one skill.')
      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    let finalPhotoUrl = photoUrl
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const path = `${user.id}-${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('worker-photos')
        .upload(path, photoFile, { upsert: true })
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from('worker-photos').getPublicUrl(path)
        finalPhotoUrl = urlData.publicUrl
      }
    }

    await supabase.from('workers').update({ district, bio, photo_url: finalPhotoUrl }).eq('id', user.id)

    await supabase.from('worker_towns').delete().eq('worker_id', user.id)
    await supabase.from('worker_towns').insert(selectedTowns.map(t => ({ worker_id: user.id, town: t })))

    await supabase.from('worker_skills').delete().eq('worker_id', user.id)
    const skillRows = selectedSkills.map(skill => {
      const category = Object.keys(CATEGORIES).find(cat =>
        CATEGORIES[cat].some(s => s.skill === skill)
      )
      return { worker_id: user.id, category, skill }
    })
    await supabase.from('worker_skills').insert(skillRows)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#aaa' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        .section-card { background: white; border: 1px solid #eddcc6; border-radius: 10px; padding: 1.5rem; margin-bottom: 1.25rem; }
        .section-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #7eacb5; margin-bottom: 0.75rem; }
        .input { width: 100%; padding: 0.7rem 0.875rem; border: 1px solid #eddcc6; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #2d2d2d; background: white; outline: none; transition: border 0.2s; }
        .input:focus { border-color: #bf4646; }
        .select { width: 100%; padding: 0.7rem 0.875rem; border: 1px solid #eddcc6; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #2d2d2d; background: white; outline: none; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.875rem center; }
        .select:focus { border-color: #bf4646; }
        .town-tag { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.75rem; background: #eddcc6; border-radius: 20px; font-size: 0.75rem; font-weight: 500; color: #5a3a2a; cursor: pointer; transition: all 0.15s; }
        .town-tag.selected { background: #bf4646; color: white; }
        .town-tag:hover { opacity: 0.85; }
        .cat-tab { padding: 0.45rem 0.875rem; border: 1px solid #eddcc6; border-radius: 20px; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; cursor: pointer; background: white; color: #888; transition: all 0.2s; white-space: nowrap; }
        .cat-tab.active { background: #2d2d2d; color: white; border-color: #2d2d2d; }
        .skill-chip { position: relative; display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.875rem; border: 1px solid #eddcc6; border-radius: 6px; font-size: 0.82rem; font-weight: 500; cursor: pointer; background: white; color: #555; transition: all 0.15s; margin: 0.25rem; }
        .skill-chip:hover { border-color: #bf4646; color: #bf4646; }
        .skill-chip.selected { background: #bf4646; color: white; border-color: #bf4646; }
        .skill-tooltip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #2d2d2d; color: white; font-size: 0.72rem; line-height: 1.5; padding: 0.5rem 0.75rem; border-radius: 6px; width: 200px; text-align: center; pointer-events: none; z-index: 100; }
        .skill-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: #2d2d2d; }
        .save-btn { width: 100%; padding: 0.875rem; background: #bf4646; color: white; border: none; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: background 0.2s; }
        .save-btn:hover:not(:disabled) { background: #a33a3a; }
        .save-btn:disabled { background: #ccc; cursor: not-allowed; }
        .save-btn.success { background: #4e8c6b; }
        textarea.input { resize: vertical; min-height: 90px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #eddcc6', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <button
          onClick={() => router.push('/worker/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem', fontWeight: 500 }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <p className="serif" style={{ fontSize: '1rem', fontWeight: 700, color: '#2d2d2d' }}>Edit Profile</p>
        <div style={{ width: '120px' }} />
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem 3rem' }}>

        <div style={{ marginBottom: '1.75rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Your Profile</p>
          <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>Update your details</h1>
          <p style={{ fontSize: '0.875rem', color: '#aaa', marginTop: '0.4rem' }}>Changes will be visible to users immediately.</p>
        </div>

        {/* Photo */}
        <div className="section-card">
          <p className="section-label">Profile Photo</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              onClick={() => fileRef.current.click()}
              style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #eddcc6', background: '#fff4ea', cursor: 'pointer', position: 'relative', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {photoPreview
                ? <img src={photoPreview} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Camera size={24} color="#ccc" strokeWidth={1.5} />
              }
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2d2d2d', marginBottom: '0.3rem' }}>Tap to change photo</p>
              <p style={{ fontSize: '0.78rem', color: '#aaa' }}>JPG or PNG, max 5MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          </div>
        </div>

        {/* District */}
        <div className="section-card">
          <p className="section-label">District</p>
          <select
            className="select"
            value={district}
            onChange={e => { setDistrict(e.target.value); setSelectedTowns([]) }}
          >
            <option value="">Select your district</option>
            {Object.keys(DISTRICTS_AND_TOWNS).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Towns */}
        {district && (
          <div className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <p className="section-label" style={{ marginBottom: 0 }}>Towns you cover</p>
              <span style={{ fontSize: '0.72rem', color: '#aaa' }}>{selectedTowns.length} selected</span>
            </div>
            <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
              <Search size={14} color="#aaa" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="input"
                placeholder="Search towns..."
                value={townSearch}
                onChange={e => setTownSearch(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>

            {selectedTowns.length > 0 && (
              <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: '#fff4ea', borderRadius: '6px' }}>
                <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.5rem' }}>Selected</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedTowns.map(t => (
                    <span key={t} className="town-tag selected" onClick={() => toggleTown(t)}>{t} ✕</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
              {towns.filter(t => !selectedTowns.includes(t)).map(t => (
                <span key={t} className="town-tag" onClick={() => toggleTown(t)}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div className="section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
            <p className="section-label" style={{ marginBottom: 0 }}>Your Skills</p>
            <span style={{ fontSize: '0.72rem', color: '#aaa' }}>{selectedSkills.length} selected</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            {Object.keys(CATEGORIES).map(cat => (
              <button key={cat} className={`cat-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-0.25rem' }}>
            {CATEGORIES[activeCategory].map(({ skill, desc }) => (
              <button
                key={skill}
                className={`skill-chip ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                onClick={() => toggleSkill(skill)}
                onMouseEnter={() => setTooltip(skill)}
                onMouseLeave={() => setTooltip(null)}
              >
                {selectedSkills.includes(skill) && <CheckCircle size={13} />}
                {skill}
                {tooltip === skill && <span className="skill-tooltip">{desc}</span>}
              </button>
            ))}
          </div>

          {selectedSkills.filter(s => !CATEGORIES[activeCategory].some(c => c.skill === s)).length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eddcc6' }}>
              <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '0.5rem' }}>Other selected skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {selectedSkills
                  .filter(s => !CATEGORIES[activeCategory].some(c => c.skill === s))
                  .map(s => (
                    <span
                      key={s}
                      onClick={() => toggleSkill(s)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', background: '#bf4646', color: 'white', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer' }}
                    >
                      {s} ✕
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="section-card">
          <p className="section-label">Bio <span style={{ color: '#ccc', textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>(optional)</span></p>
          <textarea
            className="input"
            placeholder="Tell users a bit about yourself, your experience, years of work, etc."
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`save-btn ${saved ? 'success' : ''}`}
        >
          {saving
            ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</>
            : saved
            ? <><CheckCircle size={16} /> Saved!</>
            : <><Save size={16} /> Save Changes</>
          }
        </button>

      </div>
    </div>
  )
}