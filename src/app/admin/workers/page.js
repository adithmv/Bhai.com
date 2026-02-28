'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { CheckCircle, XCircle, Ban, MapPin, Phone, Star } from 'lucide-react'

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchWorkers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('workers')
      .select('*, profiles(full_name, phone), worker_skills(skill, category), worker_towns(town)')
      .eq('status', filter)
      .order('created_at', { ascending: false })
    setWorkers(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchWorkers() }, [filter])

  const updateStatus = async (id, status) => {
    await supabase.from('workers').update({ status }).eq('id', id)
    fetchWorkers()
  }

  const tabs = ['pending', 'approved', 'rejected', 'banned']

  return (
    <div>
      <style>{`
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .tab { padding: 0.5rem 1rem; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; cursor: pointer; border-radius: 20px; transition: all 0.2s; color: #888; text-transform: capitalize; }
        .tab.active { background: #bf4646; color: white; font-weight: 600; }
        .worker-card { background: white; border: 1px solid #eddcc6; border-radius: 10px; overflow: hidden; margin-bottom: 1rem; }
        .skill-tag { background: #fdf5f5; color: #bf4646; border: 1px solid #f0d5d5; font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.5rem; border-radius: 20px; }
        .town-tag { background: #f0f7f8; color: #7eacb5; font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 20px; }
        .action-btn { padding: 0.55rem 1rem; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.78rem; cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; gap: 0.35rem; }
      `}</style>

      <div style={{ marginBottom: '2rem' }}>
        <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Manage</p>
        <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>Workers</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'white', padding: '0.4rem', borderRadius: '30px', border: '1px solid #eddcc6', width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`tab ${filter === t ? 'active' : ''}`}>{t}</button>
        ))}
      </div>

      {loading ? (
        <p className="sans" style={{ color: '#aaa', fontSize: '0.875rem' }}>Loading...</p>
      ) : workers.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #eddcc6', borderRadius: '10px', padding: '3rem', textAlign: 'center' }}>
          <p className="sans" style={{ color: '#aaa', fontSize: '0.875rem' }}>No {filter} workers.</p>
        </div>
      ) : (
        workers.map(worker => (
          <div key={worker.id} className="worker-card">
            <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <img src={worker.photo_url} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eddcc6', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.35rem' }}>
                  <p className="sans" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2d2d2d' }}>{worker.profiles?.full_name}</p>
                  {worker.average_rating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                      <Star size={12} color="#bf4646" fill="#bf4646" />
                      <span className="sans" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d2d2d' }}>{worker.average_rating}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={11} /> {worker.district}
                  </p>
                  <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Phone size={11} /> {worker.profiles?.phone}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  {worker.worker_skills?.map(s => <span key={s.skill} className="skill-tag">{s.skill}</span>)}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {worker.worker_towns?.map(t => <span key={t.town} className="town-tag">{t.town}</span>)}
                </div>

                {worker.bio && (
                  <p className="sans" style={{ fontSize: '0.78rem', color: '#bbb', fontStyle: 'italic' }}>"{worker.bio}"</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid #f5ede3', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {filter === 'pending' && (
                <>
                  <button className="action-btn" onClick={() => updateStatus(worker.id, 'approved')}
                    style={{ background: '#eef7f2', color: '#4e8c6b' }}>
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button className="action-btn" onClick={() => updateStatus(worker.id, 'rejected')}
                    style={{ background: '#fdf0f0', color: '#bf4646' }}>
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}
              {filter === 'approved' && (
                <button className="action-btn" onClick={() => updateStatus(worker.id, 'banned')}
                  style={{ background: '#fdf0f0', color: '#bf4646' }}>
                  <Ban size={14} /> Ban Worker
                </button>
              )}
              {(filter === 'rejected' || filter === 'banned') && (
                <button className="action-btn" onClick={() => updateStatus(worker.id, 'approved')}
                  style={{ background: '#eef7f2', color: '#4e8c6b' }}>
                  <CheckCircle size={14} /> Approve
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
