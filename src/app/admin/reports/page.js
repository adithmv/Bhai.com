'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Phone, Calendar, CheckCircle, AlertTriangle, Ban } from 'lucide-react'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchReports = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reports')
      .select('*, profiles(full_name, phone), workers(district, profiles(full_name, phone)), bookings(work_date, work_description)')
      .eq('status', filter)
      .order('created_at', { ascending: false })
    setReports(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchReports() }, [filter])

  const updateReport = async (id, status) => {
    await supabase.from('reports').update({ status }).eq('id', id)
    fetchReports()
  }

  const banWorker = async (workerId, reportId) => {
    await supabase.from('workers').update({ status: 'banned' }).eq('id', workerId)
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId)
    fetchReports()
  }

  const tabs = ['pending', 'reviewed', 'resolved']

  return (
    <div>
      <style>{`
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .tab { padding: 0.5rem 1rem; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; cursor: pointer; border-radius: 20px; transition: all 0.2s; color: #888; text-transform: capitalize; }
        .tab.active { background: #bf4646; color: white; font-weight: 600; }
        .report-card { background: white; border: 1px solid #eddcc6; border-radius: 10px; overflow: hidden; margin-bottom: 1rem; }
        .info-block { background: #fff4ea; border-radius: 6px; padding: 0.875rem; }
        .action-btn { padding: 0.55rem 1rem; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.78rem; cursor: pointer; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; gap: 0.35rem; }
      `}</style>

      <div style={{ marginBottom: '2rem' }}>
        <p className="sans" style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.4rem' }}>Manage</p>
        <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>Reports</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'white', padding: '0.4rem', borderRadius: '30px', border: '1px solid #eddcc6', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`tab ${filter === t ? 'active' : ''}`}>{t}</button>
        ))}
      </div>

      {loading ? (
        <p className="sans" style={{ color: '#aaa', fontSize: '0.875rem' }}>Loading...</p>
      ) : reports.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #eddcc6', borderRadius: '10px', padding: '3rem', textAlign: 'center' }}>
          <p className="sans" style={{ color: '#aaa', fontSize: '0.875rem' }}>No {filter} reports.</p>
        </div>
      ) : (
        reports.map(report => (
          <div key={report.id} className="report-card">
            <div style={{ padding: '1.25rem' }}>

              <p className="sans" style={{ fontSize: '0.72rem', color: '#bbb', marginBottom: '1rem' }}>
                Reported on {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="info-block">
                  <p className="sans" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: '0.5rem' }}>Reported By</p>
                  <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '0.25rem' }}>{report.profiles?.full_name}</p>
                  <p className="sans" style={{ fontSize: '0.78rem', color: '#7eacb5', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Phone size={11} /> {report.profiles?.phone}
                  </p>
                </div>
                <div className="info-block">
                  <p className="sans" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: '0.5rem' }}>Worker</p>
                  <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '0.25rem' }}>{report.workers?.profiles?.full_name}</p>
                  <p className="sans" style={{ fontSize: '0.78rem', color: '#7eacb5', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Phone size={11} /> {report.workers?.profiles?.phone}
                  </p>
                </div>
              </div>

              {report.bookings?.work_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Calendar size={13} color="#aaa" />
                  <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa' }}>
                    Work date: {new Date(report.bookings.work_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              )}

              <div className="info-block">
                <p className="sans" style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#aaa', marginBottom: '0.5rem' }}>Report Reason</p>
                <p className="sans" style={{ fontSize: '0.875rem', color: '#2d2d2d', lineHeight: 1.6 }}>{report.reason}</p>
              </div>
            </div>

            <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid #f5ede3', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {filter === 'pending' && (
                <button className="action-btn" onClick={() => updateReport(report.id, 'reviewed')}
                  style={{ background: '#fdf8ee', color: '#bf9c4e' }}>
                  <AlertTriangle size={14} /> Mark Reviewed
                </button>
              )}
              {(filter === 'pending' || filter === 'reviewed') && (
                <>
                  <button className="action-btn" onClick={() => banWorker(report.worker_id, report.id)}
                    style={{ background: '#fdf0f0', color: '#bf4646' }}>
                    <Ban size={14} /> Ban Worker
                  </button>
                  <button className="action-btn" onClick={() => updateReport(report.id, 'resolved')}
                    style={{ background: '#eef7f2', color: '#4e8c6b' }}>
                    <CheckCircle size={14} /> Resolve
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
