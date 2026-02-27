'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchReports = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reports')
      .select(`
        *,
        profiles (full_name, phone),
        workers (
          district,
          profiles (full_name, phone)
        ),
        bookings (work_date, work_description)
      `)
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Reports</h1>

      <div className="flex gap-3 mb-6">
        {['pending', 'reviewed', 'resolved'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              filter === s ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-400">No {filter} reports.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map(report => (
            <div key={report.id} className="bg-gray-900 rounded-2xl p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs mb-3">
                    Reported on {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-gray-500 text-xs mb-1">Reported By</p>
                      <p className="text-white font-medium">{report.profiles?.full_name}</p>
                      <p className="text-orange-400 text-sm">📞 {report.profiles?.phone}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-3">
                      <p className="text-gray-500 text-xs mb-1">Worker</p>
                      <p className="text-white font-medium">{report.workers?.profiles?.full_name}</p>
                      <p className="text-orange-400 text-sm">📞 {report.workers?.profiles?.phone}</p>
                      <p className="text-gray-400 text-xs">📍 {report.workers?.district}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-3 mb-3">
                    <p className="text-gray-500 text-xs mb-1">Work Date</p>
                    <p className="text-gray-300 text-sm">
                      {report.bookings?.work_date
                        ? new Date(report.bookings.work_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-3 mb-3">
                    <p className="text-gray-500 text-xs mb-1">Report Reason</p>
                    <p className="text-gray-300 text-sm">{report.reason}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {filter === 'pending' && (
                    <button
                      onClick={() => updateReport(report.id, 'reviewed')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {(filter === 'pending' || filter === 'reviewed') && (
                    <>
                      <button
                        onClick={() => banWorker(report.worker_id, report.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Ban Worker
                      </button>
                      <button
                        onClick={() => updateReport(report.id, 'resolved')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Resolve
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
