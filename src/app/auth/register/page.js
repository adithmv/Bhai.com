'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, HardHat, Home } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '', role: 'user' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: signUpError } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    const { error: profileError } = await supabase.from('profiles').insert({ id: data.user.id, full_name: form.full_name, phone: form.phone, role: form.role })
    if (profileError) { setError(profileError.message); setLoading(false); return }
    if (form.role === 'worker') router.push('/worker/profile')
    else router.push('/user/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }

        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%); pointer-events: none; }
        .input-field {
          width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem;
          background: white; border: 1.5px solid #eddcc6;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: #2d2d2d; outline: none; transition: border-color 0.2s;
          border-radius: 6px;
        }
        .input-field:focus { border-color: #bf4646; }
        .input-field::placeholder { color: #bbb; }

        .submit-btn {
          width: 100%; padding: 0.9rem;
          background: #bf4646; color: white; border: none;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          border-radius: 6px;
        }
        .submit-btn:hover:not(:disabled) { background: #a83c3c; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .role-btn {
          flex: 1; padding: 0.875rem 0.5rem;
          border: 1.5px solid #eddcc6; background: white;
          cursor: pointer; transition: all 0.2s;
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
          border-radius: 6px; font-family: 'DM Sans', sans-serif;
        }
        .role-btn.active { border-color: #bf4646; background: #fdf5f5; }

        .card {
          background: white;
          border: 1px solid #eddcc6;
          border-radius: 12px;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          box-shadow: 0 4px 32px rgba(191,70,70,0.06);
        }

        @media (max-width: 480px) {
          .card { padding: 2rem 1.25rem; border-radius: 0; border-left: none; border-right: none; box-shadow: none; }
        }
      `}</style>

      {/* Top bar */}
      <div style={{ background: '#2d2d2d', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Image src="/logo.png" alt="Bhai.com" width={100} height={32} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
        <a href="/auth/login" className="sans" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 500 }}>
          Already registered? Login
        </a>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>

        <div className="card">
          <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
            <p className="sans" style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.5rem' }}>Create Account</p>
            <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>Get started today</h1>
          </div>

          {/* Role selector */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button type="button" className={`role-btn ${form.role === 'user' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'user' })}>
              <Home size={20} color={form.role === 'user' ? '#bf4646' : '#bbb'} strokeWidth={1.5} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: form.role === 'user' ? '#bf4646' : '#999' }}>Need a Bhai</span>
            </button>
            <button type="button" className={`role-btn ${form.role === 'worker' ? 'active' : ''}`} onClick={() => setForm({ ...form, role: 'worker' })}>
              <HardHat size={20} color={form.role === 'worker' ? '#bf4646' : '#bbb'} strokeWidth={1.5} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: form.role === 'worker' ? '#bf4646' : '#999' }}>I am a Bhai</span>
            </button>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div className="input-wrap">
              <span className="input-icon"><User size={16} color="#bbb" /></span>
              <input type="text" name="full_name" placeholder="Full name" value={form.full_name} onChange={handleChange} required className="input-field" />
            </div>

            <div className="input-wrap">
              <span className="input-icon"><Phone size={16} color="#bbb" /></span>
              <input type="tel" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required className="input-field" />
            </div>

            <div className="input-wrap">
              <span className="input-icon"><Mail size={16} color="#bbb" /></span>
              <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required className="input-field" />
            </div>

            <div className="input-wrap">
              <span className="input-icon"><Lock size={16} color="#bbb" /></span>
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="input-field" style={{ paddingRight: '2.75rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPassword ? <EyeOff size={16} color="#bbb" /> : <Eye size={16} color="#bbb" />}
              </button>
            </div>

            {form.role === 'worker' && (
              <div style={{ background: '#f0f7f8', border: '1px solid #c5dde0', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                <p className="sans" style={{ fontSize: '0.78rem', color: '#7eacb5', fontWeight: 500 }}>
                  After registration you'll complete your worker profile with skills, location and photo.
                </p>
              </div>
            )}

            {error && (
              <div style={{ background: '#fdf0f0', border: '1px solid #f5c6c6', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                <p className="sans" style={{ fontSize: '0.82rem', color: '#bf4646' }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn" style={{ marginTop: '0.25rem' }}>
              {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>

          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f0e4d6', textAlign: 'center' }}>
            <p className="sans" style={{ fontSize: '0.82rem', color: '#aaa' }}>
              Already have an account?{' '}
              <a href="/auth/login" style={{ color: '#bf4646', textDecoration: 'none', fontWeight: 600 }}>Sign in</a>
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #eddcc6' }}>
        <p className="sans" style={{ fontSize: '0.72rem', color: '#bbb' }}>© 2025 bhai.com — Made with care in Kerala</p>
      </div>

    </div>
  )
}
