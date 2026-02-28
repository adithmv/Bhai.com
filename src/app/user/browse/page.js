'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, MapPin, Star, ChevronLeft, SlidersHorizontal, Wrench, ArrowRight } from 'lucide-react'
import LogoutButton from '@/components/shared/LogoutButton'

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

const ALL_SKILLS = ['Electrician','Plumber','Carpenter (Ashari)','Mason (Mestri)','Painter','Material Shifting','Earthwork / Digging','Land Clearing','Construction Debris Removal','Coconut Climber (Thenga Kayattam)','Grass / Bush Cutting','Well Maintenance','Event Helper / Cook','AC & Fridge Technician','Inverter / Solar Fixer','CCTV & Wi-Fi Setup','Washing Machine / Oven Repair','Welder','Gardener','Two-Wheeler / Car Mechanic','Small Load Pickup (Tempo)']

export default function BrowsePage() {
  const [district, setDistrict] = useState('')
  const [townSearch, setTownSearch] = useState('')
  const [selectedTowns, setSelectedTowns] = useState([])
  const [skill, setSkill] = useState('')
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const availableTowns = district ? DISTRICTS_AND_TOWNS[district].filter(t => t.toLowerCase().includes(townSearch.toLowerCase())) : []

  const toggleTown = (town) => {
    setSelectedTowns(prev => prev.includes(town) ? prev.filter(t => t !== town) : [...prev, town])
  }

  const fetchWorkers = async () => {
    if (!district) return
    setLoading(true)
    setSearched(true)
    const { data } = await supabase
      .from('workers')
      .select('*, profiles(full_name), worker_skills(skill, category), worker_towns(town)')
      .eq('status', 'approved')
      .eq('district', district)

    let results = data || []
    if (selectedTowns.length > 0) results = results.filter(w => w.worker_towns?.some(t => selectedTowns.includes(t.town)))
    if (skill) results = results.filter(w => w.worker_skills?.some(s => s.skill === skill))
    setWorkers(results)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .nav { background: white; border-bottom: 1px solid #eddcc6; padding: 0 1.5rem; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .select-field {
          width: 100%; padding: 0.8rem 1rem; background: white;
          border: 1.5px solid #eddcc6; font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; color: #2d2d2d; outline: none;
          transition: border-color 0.2s; border-radius: 6px; cursor: pointer;
        }
        .select-field:focus { border-color: #bf4646; }
        .search-input {
          width: 100%; padding: 0.75rem 1rem; background: white;
          border: 1.5px solid #eddcc6; font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; color: #2d2d2d; outline: none;
          transition: border-color 0.2s; border-radius: 6px;
        }
        .search-input:focus { border-color: #bf4646; }
        .search-input::placeholder { color: #bbb; }
        .search-btn {
          width: 100%; padding: 0.875rem; background: #bf4646; color: white;
          border: none; font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.875rem; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          border-radius: 6px;
        }
        .search-btn:hover:not(:disabled) { background: #a83c3c; }
        .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .worker-card {
          background: white; border: 1px solid #eddcc6; border-radius: 10px;
          overflow: hidden; transition: all 0.2s;
        }
        .worker-card:hover { box-shadow: 0 4px 20px rgba(191,70,70,0.08); transform: translateY(-2px); }
        .tag-pill { background: #fdf5f5; color: #bf4646; border: 1px solid #f0d5d5; font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 20px; }
        .town-pill { background: #f0f7f8; color: #7eacb5; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 20px; }
        .book-btn {
          background: #bf4646; color: white; border: none; padding: 0.7rem 1.25rem;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.82rem;
          cursor: pointer; border-radius: 6px; transition: all 0.2s;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .book-btn:hover { background: #a83c3c; }
      `}</style>

      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a href="/user/dashboard" style={{ display: 'flex', alignItems: 'center', color: '#888', textDecoration: 'none' }}>
            <ChevronLeft size={20} />
          </a>
          <Image src="/logo.png" alt="Bhai.com" width={80} height={26} style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a href="/user/bookings" style={{ fontSize: '0.82rem', color: '#888', textDecoration: 'none', fontWeight: 500 }}>My Bookings</a>
          <LogoutButton />
        </div>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Browse</p>
          <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>Find a Bhai</h1>
        </div>

        {/* Filters */}
        <div style={{ background: 'white', border: '1px solid #eddcc6', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SlidersHorizontal size={15} color="#bf4646" /> Filters
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select value={district} onChange={e => { setDistrict(e.target.value); setSelectedTowns([]); setTownSearch('') }} className="select-field">
              <option value="">Select District *</option>
              {Object.keys(DISTRICTS_AND_TOWNS).map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            {district && (
              <div>
                <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '0.5rem' }}>Filter by town (optional)</p>
                <input type="text" placeholder="Search towns..." value={townSearch} onChange={e => setTownSearch(e.target.value)} className="search-input" style={{ marginBottom: '0.5rem' }} />
                <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {availableTowns.map(town => (
                    <label key={town} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', background: selectedTowns.includes(town) ? '#fdf5f5' : 'transparent' }}>
                      <input type="checkbox" checked={selectedTowns.includes(town)} onChange={() => toggleTown(town)} style={{ accentColor: '#bf4646' }} />
                      <span className="sans" style={{ fontSize: '0.82rem', color: '#2d2d2d' }}>{town}</span>
                    </label>
                  ))}
                </div>
                {selectedTowns.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                    {selectedTowns.map(t => (
                      <span key={t} onClick={() => toggleTown(t)} style={{ background: '#7eacb5', color: 'white', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '20px', cursor: 'pointer' }}>
                        {t} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <select value={skill} onChange={e => setSkill(e.target.value)} className="select-field">
              <option value="">All Skills (optional)</option>
              {ALL_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <button onClick={fetchWorkers} disabled={!district || loading} className="search-btn">
              <Search size={16} /> {loading ? 'Searching...' : 'Search Workers'}
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && !loading && workers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'white', border: '1px solid #eddcc6', borderRadius: '10px' }}>
            <Wrench size={32} color="#ddd" strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
            <p className="sans" style={{ fontSize: '0.875rem', color: '#bbb' }}>No Bhais found in this area. Try a different district or skill.</p>
          </div>
        )}

        {workers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p className="sans" style={{ fontSize: '0.82rem', color: '#aaa' }}>{workers.length} worker{workers.length > 1 ? 's' : ''} found</p>
            {workers.map(worker => (
              <div key={worker.id} className="worker-card">
                <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid #eddcc6' }}>
                    <img src={worker.photo_url} alt={worker.profiles?.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <p className="sans" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d2d2d' }}>{worker.profiles?.full_name}</p>
                      {worker.average_rating > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                          <Star size={12} color="#bf4646" fill="#bf4646" />
                          <span className="sans" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d2d' }}>{worker.average_rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.6rem' }}>
                      <MapPin size={11} /> {worker.district}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                      {worker.worker_skills?.map(s => <span key={s.skill} className="tag-pill">{s.skill}</span>)}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {worker.worker_towns?.slice(0, 3).map(t => <span key={t.town} className="town-pill">{t.town}</span>)}
                      {worker.worker_towns?.length > 3 && <span className="town-pill">+{worker.worker_towns.length - 3} more</span>}
                    </div>
                    {worker.bio && <p className="sans" style={{ fontSize: '0.78rem', color: '#bbb', marginTop: '0.5rem', fontStyle: 'italic' }}>"{worker.bio}"</p>}
                  </div>
                </div>
                <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid #f5ede3', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => router.push(`/user/browse/${worker.id}`)} className="book-btn">
                    Book this Bhai <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
