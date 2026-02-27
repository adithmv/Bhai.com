'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchWorkers = async () => {
    setLoading(true)

    const { data } = await supabase
      .from('workers')
     .select(`
        *,
        profiles (full_name, phone),
        worker_skills (skill, category),
        worker_towns (town)
    `)
      .eq('status', filter)
      .order('created_at', { ascending: false })

    setWorkers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWorkers()
  }, [filter])

  const updateStatus = async (id, status) => {
    await supabase.from('workers').update({ status }).eq('id', id)
    fetchWorkers()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Worker Approvals</h1>

      <div className="flex gap-3 mb-6">
        {['pending', 'approved', 'rejected', 'banned'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              filter === s
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : workers.length === 0 ? (
        <p className="text-gray-400">No workers found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-gray-900 rounded-2xl p-6 flex gap-6">

              <img
                src={worker.photo_url}
                alt={worker.profiles?.full_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 flex-shrink-0"
              />

              <div className="flex-1">
                <h2 className="text-white text-xl font-bold">{worker.profiles?.full_name}</h2>
                <p className="text-gray-400 text-sm mb-1">📞 {worker.profiles?.phone}</p>
                <p className="text-gray-400 text-sm mb-1">📍 {worker.district}</p>
<div className="flex flex-wrap gap-1 mb-2">
  {worker.worker_towns?.map(t => (
    <span key={t.town} className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
      {t.town}
    </span>
  ))}
</div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {worker.worker_skills?.map((s) => (
                    <span key={s.skill} className="bg-orange-500 bg-opacity-20 text-orange-300 text-xs px-2 py-1 rounded-full">
                      {s.skill}
                    </span>
                  ))}
                </div>

                {worker.bio && (
                  <p className="text-gray-400 text-sm italic">&quot;{worker.bio}&quot;</p>
                )}
              </div>

              <div className="flex flex-col gap-2 justify-center">
                {filter === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(worker.id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(worker.id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                      Reject
                    </button>
                  </>
                )}
                {filter === 'approved' && (
                  <button
                    onClick={() => updateStatus(worker.id, 'banned')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Ban
                  </button>
                )}
                {(filter === 'rejected' || filter === 'banned') && (
                  <button
                    onClick={() => updateStatus(worker.id, 'approved')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Approve
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}