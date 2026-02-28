'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Camera, MapPin, ChevronRight, CheckCircle, Search } from 'lucide-react'

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
    { skill: 'Welder', desc: 'Fixing iron gates, grills, or any metal fabrication.' },
    { skill: 'Gardener', desc: 'Planting, pruning, and maintaining the garden or lawn.' },
    { skill: 'Two-Wheeler / Car Mechanic', desc: 'Basic doorstep service like oil changes or puncture repair.' },
    { skill: 'Small Load Pickup (Tempo)', desc: 'Transporting heavy items like a fridge, cupboard, or a few bags of cement.' },
  ],
}

export default function WorkerProfileSetup() {
  const [form, setForm] = useState({ district: '', bio: '' })
  const [townSearch, setTownSearch] = useState('')
  const [selectedTowns, setSelectedTowns] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [activeCategory, setActiveCategory] = useState(Object.keys(CATEGORIES)[0])
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const availableTowns = form.district
    ? DISTRICTS_AND_TOWNS[form.district].filter(t => t.toLowerCase().includes(townSearch.toLowerCase()))
    : []

  const toggleTown = (town) => setSelectedTowns(prev => prev.includes(town) ? prev.filter(t => t !== town) : [...prev, town])
  const toggleSkill = (category, skill) => {
    const exists = selectedSkills.find(s => s.skill === skill && s.category === category)
    if (exists) setSelectedSkills(selectedSkills.filter(s => !(s.skill === skill && s.category === category)))
    else setSelectedSkills([...selectedSkills, { category, skill }])
  }
  const isSelected = (category, skill) => !!selectedSkills.find(s => s.skill === skill && s.category === category)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) { setPhoto(file); setPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (selectedSkills.length === 0) { setError('Please select at least one skill.'); setLoading(false); return }
    if (selectedTowns.length === 0) { setError('Please select at least one town.'); setLoading(false); return }
    if (!photo) { setError('Please upload a profile photo.'); setLoading(false); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const fileExt = photo.name.split('.').pop()
    const fileName = `${user.id}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('worker-photos').upload(fileName, photo, { upsert: true })
    if (uploadError) { setError('Photo upload failed.'); setLoading(false); return }

    const { data: urlData } = supabase.storage.from('worker-photos').getPublicUrl(fileName)

    const { error: workerError } = await supabase.from('workers').insert({ id: user.id, district: form.district, bio: form.bio, photo_url: urlData.publicUrl })
    if (workerError) { setError(workerError.message); setLoading(false); return }

    const { error: skillsError } = await supabase.from('worker_skills').insert(selectedSkills.map(s => ({ worker_id: user.id, category: s.category, skill: s.skill })))
    if (skillsError) { setError(skillsError.message); setLoading(false); return }

    const { error: townsError } = await supabase.from('worker_towns').insert(selectedTowns.map(t => ({ worker_id: user.id, town: t })))
    if (townsError) { setError(townsError.message); setLoading(false); return }

    router.push('/worker/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .select-field { width: 100%; padding: 0.8rem 1rem; background: white; border: 1.5px solid #eddcc6; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #2d2d2d; outline: none; border-radius: 6px; cursor: pointer; }
        .select-field:focus { border-color: #bf4646; }
        .search-input { width: 100%; padding: 0.7rem 1rem 0.7rem 2.5rem; background: white; border: 1.5px solid #eddcc6; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #2d2d2d; outline: none; border-radius: 6px; }
        .search-input:focus { border-color: #bf4646; }
        .search-input::placeholder { color: #bbb; }
        .cat-tab { padding: 0.45rem 0.875rem; border: 1px solid #eddcc6; background: white; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 500; cursor: pointer; border-radius: 20px; transition: all 0.2s; color: #888; white-space: nowrap; }
        .cat-tab.active { background: #bf4646; border-color: #bf4646; color: white; font-weight: 600; }
        .skill-btn { width: 100%; padding: 0.7rem 0.875rem; background: white; border: 1.5px solid #eddcc6; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; cursor: pointer; border-radius: 6px; transition: all 0.2s; color: #2d2d2d; text-align: left; }
        .skill-btn.selected { background: #fdf5f5; border-color: #bf4646; color: #bf4646; font-weight: 600; }
        .skill-btn:hover:not(.selected) { border-color: #ddd; background: #fafafa; }
        .submit-btn { width: 100%; padding: 0.9rem; background: #bf4646; color: white; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; border-radius: 6px; transition: all 0.2s; }
        .submit-btn:hover:not(:disabled) { background: #a83c3c; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .card { background: white; border: 1px solid #eddcc6; border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; }
        .textarea-field { width: 100%; padding: 0.8rem 1rem; background: white; border: 1.5px solid #eddcc6; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #2d2d2d; outline: none; border-radius: 6px; resize: none; }
        .textarea-field:focus { border-color: #bf4646; }
        .textarea-field::placeholder { color: #bbb; }
      `}</style>

      {/* Top bar */}
      <div style={{ background: '#bf4646', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Image src="/logo.png" alt="Bhai.com" width={100} height={32} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        <p className="sans" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Complete your profile</p>
      </div>

      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Worker Profile</p>
          <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>Set up your profile</h1>
          <p className="sans" style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.25rem' }}>This will be reviewed by our admin before you go live.</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Photo */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #eddcc6', flexShrink: 0, background: '#f5ede3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {preview
                ? <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Camera size={24} color="#ddd" strokeWidth={1.5} />
              }
            </div>
            <div>
              <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '0.25rem' }}>Profile Photo *</p>
              <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '0.75rem' }}>A clear photo helps users trust you</p>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fff4ea', border: '1px solid #eddcc6', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#bf4646' }}>
                <Camera size={13} /> {preview ? 'Change Photo' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* District */}
          <div className="card">
            <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} color="#bf4646" /> Location
            </p>
            <select value={form.district} onChange={e => { setForm({ ...form, district: e.target.value }); setSelectedTowns([]); setTownSearch('') }} required className="select-field" style={{ marginBottom: form.district ? '1rem' : 0 }}>
              <option value="">Select your district *</option>
              {Object.keys(DISTRICTS_AND_TOWNS).map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {form.district && (
              <div>
                <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '0.5rem' }}>Select towns you cover *</p>
                <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                  <Search size={14} color="#bbb" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type="text" placeholder="Search towns..." value={townSearch} onChange={e => setTownSearch(e.target.value)} className="search-input" />
                </div>
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {availableTowns.map(town => (
                    <label key={town} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', background: selectedTowns.includes(town) ? '#fdf5f5' : 'transparent' }}>
                      <input type="checkbox" checked={selectedTowns.includes(town)} onChange={() => toggleTown(town)} style={{ accentColor: '#bf4646' }} />
                      <span className="sans" style={{ fontSize: '0.82rem', color: '#2d2d2d' }}>{town}</span>
                      {selectedTowns.includes(town) && <CheckCircle size={13} color="#bf4646" style={{ marginLeft: 'auto' }} />}
                    </label>
                  ))}
                </div>
                {selectedTowns.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                    {selectedTowns.map(t => (
                      <span key={t} onClick={() => toggleTown(t)} style={{ background: '#bf4646', color: 'white', fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '20px', cursor: 'pointer' }}>
                        {t} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="card">
            <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '1rem' }}>Your Skills *</p>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {Object.keys(CATEGORIES).map(cat => (
                <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}>{cat}</button>
              ))}
            </div>

            {/* Skills grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {CATEGORIES[activeCategory].map(({ skill, desc }) => (
                <div key={skill} style={{ position: 'relative' }}>
                  <button type="button" onClick={() => toggleSkill(activeCategory, skill)}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`skill-btn ${isSelected(activeCategory, skill) ? 'selected' : ''}`}>
                    {isSelected(activeCategory, skill) && <CheckCircle size={12} color="#bf4646" style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />}
                    {skill}
                  </button>
                  {hoveredSkill === skill && (
                    <div style={{ position: 'absolute', zIndex: 10, bottom: '100%', left: 0, marginBottom: '6px', width: '220px', background: '#2d2d2d', color: 'white', fontSize: '0.75rem', borderRadius: '6px', padding: '0.6rem 0.875rem', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', lineHeight: 1.5 }}>
                      {desc}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedSkills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f5ede3' }}>
                {selectedSkills.map(s => (
                  <span key={`${s.category}-${s.skill}`} style={{ background: '#fdf5f5', color: '#bf4646', border: '1px solid #f0d5d5', fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '20px' }}>
                    {s.skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="card">
            <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '0.75rem' }}>About You (Optional)</p>
            <textarea placeholder="Describe your experience, years of work, specialization..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="textarea-field" />
          </div>

          {error && (
            <div style={{ background: '#fdf0f0', border: '1px solid #f5c6c6', padding: '0.875rem 1rem', borderRadius: '6px', marginBottom: '1rem' }}>
              <p className="sans" style={{ fontSize: '0.82rem', color: '#bf4646' }}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>

        </form>
      </div>
    </div>
  )
}
