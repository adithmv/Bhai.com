'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const DISTRICTS_AND_TOWNS = {
  'Thiruvananthapuram': [
    'Thiruvananthapuram', 'Neyyattinkara', 'Nedumangad', 'Attingal', 'Varkala',
    'Alamcode', 'Andoorkonam', 'Athiyannur', 'Azhoor', 'Balaramapuram',
    'Edakkode', 'Iroopara', 'Kadakkavoor', 'Kadinamkulam', 'Kalliyoor',
    'Kanjiramkulam', 'Karakulam', 'Keezhattingal', 'Kudappanakkunnu',
    'Kulathummal', 'Malayinkeezhu', 'Menamkulam', 'Pallichal', 'Pallippuram',
    'Parassala', 'Parasuvaikkal', 'Vakkom', 'Vattappara', 'Veiloor',
    'Venganoor', 'Vilappil', 'Vilavoorkkal',
  ],
  'Kollam': [
    'Kollam', 'Punalur', 'Karunagappally', 'Paravur', 'Kottarakkara',
    'Adichanalloor', 'Adinad', 'Ayanivelikulangara', 'Chavara', 'Elampalloor',
    'Kallelibhagom', 'Kottamkara', 'Kulasekharapuram', 'Mayyanad', 'Meenad',
    'Nedumpana', 'Oachira', 'Panayam', 'Panmana', 'Perinad', 'Poothakkulam',
    'Thazhuthala', 'Thodiyoor', 'Thrikkadavoor', 'Thrikkaruva',
    'Thrikkovilvattom', 'Vadakkumthala',
  ],
  'Pathanamthitta': [
    'Thiruvalla', 'Pathanamthitta', 'Adoor', 'Pandalam', 'Kozhenchery',
  ],
  'Alappuzha': [
    'Alappuzha', 'Kayamkulam', 'Cherthala', 'Mavelikkara', 'Chengannur', 'Haripad',
    'Arookutty', 'Aroor', 'Bharanikkavu', 'Chennithala', 'Cheppad', 'Chingoli',
    'Ezhupunna', 'Kandalloor', 'Kanjikkuzhi', 'Kannamangalam', 'Karthikappally',
    'Kattanam', 'Keerikkad', 'Kodamthuruth', 'Kokkothamangalam', 'Komalapuram',
    'Krishnapuram', 'Kumarapuram', 'Kurattissery', 'Kuthiathode', 'Mannanchery',
    'Mannar', 'Muhamma', 'Muthukulam', 'Pallippuram', 'Pathirappally',
    'Pathiyoor', 'Puthuppally', 'Thaikattussery', 'Thanneermukkam',
    'Thazhakara', 'Vayalar',
  ],
  'Kottayam': [
    'Kottayam', 'Changanassery', 'Pala', 'Vaikom', 'Ettumanoor', 'Erattupetta',
    'Aimanam', 'Athirampuzha', 'Chengalam South', 'Chethipuzha', 'Nattakam',
    'Paippad', 'Panachikkad', 'Perumbaikad', 'Puthuppally', 'Thrikkodithanam',
    'Vijayapuram',
  ],
  'Idukki': [
    'Thodupuzha', 'Kattappana', 'Munnar', 'Adimali', 'Painavu',
  ],
  'Ernakulam': [
    'Kochi', 'Thrippunithura', 'Kalamassery', 'Thrikkakara', 'Maradu',
    'Kothamangalam', 'Angamaly', 'North Paravur', 'Muvattupuzha', 'Perumbavoor',
    'Piravom', 'Eloor', 'Aluva', 'Koothattukulam', 'Alangad', 'Amballur',
    'Chelamattom', 'Chendamangalam', 'Chengamanad', 'Cheranallur', 'Choornikkara',
    'Chowwara', 'Edathala', 'Elamkunnapuzha', 'Eramalloor', 'Kadamakkudy',
    'Kadungalloor', 'Kakkanad', 'Kalady', 'Kanayannur', 'Karumalloor',
    'Kizhakkumbhagom', 'Koovappady', 'Kottuvally', 'Kumbalam', 'Kumbalangy',
    'Kunnathunad', 'Kureekkad', 'Manakunnam', 'Marampilly', 'Mattoor',
    'Moothakunnam', 'Mulamthuruthy', 'Mulavukad', 'Nedumbassery', 'Njarackal',
    'Puthencruz', 'Puthenvelikkara', 'Puthuvype', 'Thekkumbhagom',
    'Thiruvankulam', 'Vadakkekara', 'Vadakkumbhagom', 'Varappuzha',
    'Vazhakkala', 'Vazhakulam', 'Velloorkunnam', 'Vengola',
  ],
  'Thrissur': [
    'Thrissur', 'Kodungallur', 'Kunnamkulam', 'Chalakudy', 'Chavakkad',
    'Irinjalakuda', 'Guruvayur', 'Wadakkanchery', 'Adat', 'Akathiyoor',
    'Ala', 'Alur', 'Amballur', 'Anjur', 'Anthicad', 'Avanur', 'Avinissery',
    'Brahmakulam', 'Chelakkara', 'Chendrappini', 'Cherpu', 'Cheruthuruthy',
    'Chevvoor', 'Chiramanangad', 'Chiranellur', 'Chittanda', 'Chittilappilly',
    'Choolissery', 'Choondal', 'Desamangalam', 'Edakkalathur', 'Edakkazhiyur',
    'Edathirinji', 'Edathiruthy', 'Edavilangu', 'Elavally', 'Enkakkad',
    'Eranellur', 'Eravu', 'Eyyal', 'Iringaprom', 'Kadavallur', 'Kadikkad',
    'Kainoor', 'Kaipamangalam', 'Kaiparamba', 'Kallettumkara', 'Kallur',
    'Killannur', 'Kolazhy', 'Koratty', 'Kottappuram',
  ],
  'Palakkad': [
    'Palakkad', 'Ottappalam', 'Shoranur', 'Chittur', 'Pattambi', 'Cherpulassery',
    'Mannarkkad', 'Alathur', 'Hemambikanagar', 'Koduvayur', 'Marutharode',
    'Muthuthala', 'Ongallur', 'Pirayiri', 'Pudussery Central', 'Pudussery West',
    'Puthunagaram', 'Puthuppariyaram', 'Thrithala', 'Vaniyamkulam',
  ],
  'Malappuram': [
    'Manjeri', 'Ponnani', 'Parappanangadi', 'Tanur', 'Malappuram', 'Kondotty',
    'Tirurangadi', 'Tirur', 'Perinthalmanna', 'Nilambur', 'Kottakkal',
    'Valanchery', 'Abdu Rahiman Nagar', 'Aikkarappadi', 'Alamcode', 'Ariyallur',
    'Chelambra', 'Cherukavu', 'Cheriyamundam', 'Edappal', 'Irimbiliyam',
    'Kalady', 'Kannamangalam', 'Kattipparuthi', 'Koottilangadi', 'Kodur',
    'Kuttippuram', 'Marancheri', 'Moonniyur', 'Naduvattom', 'Nannambra',
    'Neduva', 'Othukkungal', 'Ourakam', 'Pallikkal', 'Parappur', 'Perumanna',
    'Peruvallur', 'Ponmundam', 'Talakkad', 'Tanalur', 'Thennala',
    'Thenhippalam', 'Thirunavaya', 'Triprangode', 'Urakam', 'Vazhayur', 'Vengara',
  ],
  'Kozhikode': [
    'Kozhikode', 'Vatakara', 'Koyilandy', 'Feroke', 'Payyoli', 'Koduvally',
    'Mukkam', 'Ramanattukara', 'Atholi', 'Ayancheri', 'Azhiyur', 'Balusseri',
    'Beypore', 'Chekkiad', 'Chelannur', 'Chemancheri', 'Cheruvannur', 'Chorode',
    'Edacheri', 'Eramala', 'Eravattur', 'Iringal', 'Kakkodi', 'Karuvanthuruthy',
    'Keezhariyur', 'Koothali', 'Kottappally', 'Kozhukkallur', 'Kunnamangalam',
    'Kunnummal', 'Kuruvattur', 'Kuttikkattoor', 'Maniyur', 'Mavoor', 'Meppayyur',
    'Nadapuram', 'Naduvannur', 'Nanmanda', 'Olavanna', 'Palayad', 'Panangad',
    'Pantheeramkavu', 'Perumanna', 'Peruvayal', 'Poolacode', 'Thalakkulathur',
    'Thazhecode', 'Thikkody', 'Thuneri', 'Thurayur', 'Ulliyeri', 'Valayam',
    'Villiappally',
  ],
  'Wayanad': [
    'Kalpetta', 'Mananthavady', 'Sulthan Bathery',
  ],
  'Kannur': [
    'Kannur', 'Thalassery', 'Payyannur', 'Taliparamba', 'Mattannur',
    'Koothuparamba', 'Anthoor', 'Panoor', 'Iritty', 'Sreekandapuram',
    'Ancharakandy', 'Azhikode North', 'Azhikode South', 'Chala', 'Cheleri',
    'Chelora', 'Cherukunnu', 'Cheruthazham', 'Chirakkal', 'Chockli',
    'Dharmadom', 'Elayavoor', 'Eranholi', 'Eruvatti', 'Ezhome', 'Irikkur',
    'Iriveri', 'Kadachira', 'Kadannappalli', 'Kadirur', 'Kalliasseri',
    'Kandamkunnu', 'Kanhirode', 'Kannadiparamba', 'Kannapuram', 'Karivellur',
    'Keezhallur', 'Kolacherry', 'Kolavelloor', 'Koodali', 'Kottayam-Malabar',
    'Kunhimangalam', 'Kurumathur', 'Kuttiattoor', 'Madayi', 'Manantheri',
    'Mangattidam', 'Maniyoor', 'Mavilayi', 'Mayyil', 'Mokeri', 'Munderi',
    'Muzhappilangad', 'Narath', 'New Mahe', 'Paduvilayi', 'Pallikkunnu',
    'Panniyannur', 'Pappinisseri', 'Pariyaram', 'Pathiriyad', 'Pattiom',
    'Peralassery', 'Peringathur', 'Pinarayi', 'Puzhathi', 'Thottada',
    'Valapattanam', 'Varam',
  ],
  'Kasaragod': [
    'Kasaragod', 'Kanhangad', 'Nileshwaram', 'Ajanur', 'Bangra Manjeshwar',
    'Bare', 'Chemnad', 'Chengala', 'Hosabettu', 'Keekan', 'Koipady', 'Kudlu',
    'Kunjathur', 'Madhur', 'Mangalpady', 'Maniyat', 'Manjeshwar', 'Mogral',
    'North Thrikkaripur', 'Pallikkara', 'Perole', 'Pilicode', 'Puthur',
    'Shiribagilu', 'Shiriya', 'South Thrikkaripur', 'Udma', 'Uppala',
  ],
}

const ALL_SKILLS = [
  'Electrician', 'Plumber', 'Carpenter (Ashari)', 'Mason (Mestri)', 'Painter',
  'Material Shifting', 'Earthwork / Digging', 'Land Clearing', 'Construction Debris Removal',
  'Coconut Climber (Thenga Kayattam)', 'Grass / Bush Cutting', 'Well Maintenance', 'Event Helper / Cook',
  'AC & Fridge Technician', 'Inverter / Solar Fixer', 'CCTV & Wi-Fi Setup', 'Washing Machine / Oven Repair',
  'Welder', 'Gardener', 'Two-Wheeler / Car Mechanic', 'Small Load Pickup (Tempo)',
]

export default function BrowsePage() {
  const [district, setDistrict] = useState("")
  const [townSearch, setTownSearch] = useState('')
  const [selectedTowns, setSelectedTowns] = useState([])
  const [skill, setSkill] = useState('')
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const availableTowns = district
    ? DISTRICTS_AND_TOWNS[district].filter(t =>
        t.toLowerCase().includes(townSearch.toLowerCase())
      )
    : []

  const toggleTown = (town) => {
    if (selectedTowns.includes(town)) {
      setSelectedTowns(selectedTowns.filter(t => t !== town))
    } else {
      setSelectedTowns([...selectedTowns, town])
    }
  }

  const fetchWorkers = async () => {
    if (!district) return
    setLoading(true)
    setSearched(true)

    const { data } = await supabase
      .from('workers')
      .select(`
        *,
        profiles (full_name),
        worker_skills (skill, category),
        worker_towns (town)
      `)
      .eq('status', 'approved')
      .eq('district', district)

    let results = data || []

    if (selectedTowns.length > 0) {
      results = results.filter(w =>
        w.worker_towns?.some(t => selectedTowns.includes(t.town))
      )
    }

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
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <a href="/user/dashboard" className="text-2xl font-bold text-orange-500">bhai.com</a>
        <a href="/user/bookings" className="text-gray-300 hover:text-orange-400 transition text-sm">My Bookings</a>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Find a Bhai</h1>

        <div className="bg-gray-900 rounded-2xl p-6 mb-8 space-y-4">

          {/* District */}
          <select
            value={district}
            onChange={(e) => { setDistrict(e.target.value); setSelectedTowns([]); setTownSearch('') }}
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
          >
            <option value="">Select District *</option>
            {Object.keys(DISTRICTS_AND_TOWNS).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Towns */}
          {district && (
            <div>
              <p className="text-gray-400 text-sm mb-2">Filter by Town (optional — select multiple)</p>
              <input
                type="text"
                placeholder="Search towns..."
                value={townSearch}
                onChange={(e) => setTownSearch(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 outline-none placeholder-gray-500 mb-2 text-sm"
              />
              <div className="max-h-40 overflow-y-auto flex flex-col gap-1 pr-1">
                {availableTowns.map(town => (
                  <label key={town} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTowns.includes(town)}
                      onChange={() => toggleTown(town)}
                      className="accent-orange-500"
                    />
                    <span className="text-gray-300 text-sm">{town}</span>
                  </label>
                ))}
              </div>
              {selectedTowns.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTowns.map(t => (
                    <span
                      key={t}
                      onClick={() => toggleTown(t)}
                      className="bg-orange-500 bg-opacity-20 text-orange-300 text-xs px-2 py-1 rounded-full cursor-pointer"
                    >
                      {t} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Skill Filter */}
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none"
          >
            <option value="">All Skills (optional)</option>
            {ALL_SKILLS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={fetchWorkers}
            disabled={!district}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
          >
            Search
          </button>
        </div>

        {/* Results */}
        {loading && <p className="text-gray-400">Searching...</p>}

        {!loading && searched && workers.length === 0 && (
          <p className="text-gray-400">No Bhais found. Try a different district or town.</p>
        )}

        {!loading && workers.length > 0 && (
          <div className="flex flex-col gap-4">
            {workers.map(worker => (
              <div key={worker.id} className="bg-gray-900 rounded-2xl p-6 flex gap-5 items-center">
                <img
                  src={worker.photo_url}
                  alt={worker.profiles?.full_name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 flex-shrink-0"
                />
                <div className="flex-1">
                  <h2 className="text-white text-xl font-bold">{worker.profiles?.full_name}</h2>
                  <p className="text-gray-400 text-sm mb-1">📍 {worker.district}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {worker.worker_towns?.map(t => (
                      <span key={t.town} className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">{t.town}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {worker.worker_skills?.map(s => (
                      <span key={s.skill} className="bg-orange-500 bg-opacity-20 text-orange-300 text-xs px-2 py-1 rounded-full">{s.skill}</span>
                    ))}
                  </div>
                  {worker.average_rating > 0 && (
                    <p className="text-yellow-400 text-sm">⭐ {worker.average_rating} / 5</p>
                  )}
                  {worker.bio && (
                    <p className="text-gray-500 text-sm italic mt-1">&apos;{worker.bio}&apos;</p>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/user/browse/${worker.id}`)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl transition flex-shrink-0"
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
