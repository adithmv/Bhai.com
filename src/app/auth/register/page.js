'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const user = data.user

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: form.full_name,
      phone: form.phone,
      role: form.role,
    })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    if (form.role === 'worker') {
      router.push('/worker/profile')
    } else {
      router.push('/user/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
        <p className="text-gray-400 mb-8">Join bhai.com today</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none placeholder-gray-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none placeholder-gray-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none placeholder-gray-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none placeholder-gray-500"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'user' })}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                form.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              I need a Bhai
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'worker' })}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                form.role === 'worker'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              I am a Bhai
            </button>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <a href="/auth/login" className="text-orange-400 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}