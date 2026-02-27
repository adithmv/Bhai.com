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

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id, full_name: form.full_name, phone: form.phone, role: form.role,
    })
    if (profileError) { setError(profileError.message); setLoading(false); return }

    if (form.role === 'worker') router.push('/worker/profile')
    else router.push('/user/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff4ea', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }
        .input-field {
          width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem;
          background: white; border: 1.5px solid #eddcc6;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: #2d2d2d; outline: none; transition: border-color 0.2s;
          border-radius: 4px;
        }
        .input-field:focus { border-color: #bf4646; }
        .input-field::placeholder { color: #bbb; }
        .submit-btn {
          width: 100%; padding: 0.9rem;
          background: #bf4646; color: white; border: none;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.9rem; letter-spacing: 0.04em;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          border-radius: 4px;
        }
        .submit-btn:hover:not(:disabled) { background: #a83c3c; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(191,70,70,0.25); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .role-btn {
          flex: 1; padding: 1rem;
          border: 1.5px solid #eddcc6; background: white;
          cursor: pointer; transition: all 0.2s;
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
        }
        .role-btn.active { border-color: #bf4646; background: #fdf0f0; }
        .role-btn:hover:not(.active) { border-color: #ddd; }
      `}</style>

      {/* Left panel */}
      <div style={{ background: '#2d2d2d', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', right: '-3rem', opacity: 0.06 }}>
          <HardHat size={280} color="white" strokeWidth={0.5} />
        </div>

        <Image src="/logo.png" alt="Bhai.com" width={110} height={36} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.8, position: 'relative', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="serif" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '1rem' }}>
            Join<br />bhai.com.
          </h2>
          <p className="sans" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Whether you need a worker or want to offer your skills — bhai.com connects Kerala's homes with Kerala's best workers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'I need a Bhai', desc: 'Find & book workers near you', color: '#bf4646' },
              { label: 'I am a Bhai', desc: 'Offer your skills & get hired', color: '#7eacb5' },
            ].map(r => (
              <div key={r.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', borderRadius: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color, marginBottom: '0.75rem' }} />
                <p className="sans" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem' }}>{r.label}</p>
                <p className="sans" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', maxWidth: '480px', width: '100%', margin: '0 auto', overflowY: 'auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p className="sans" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.75rem' }}>Create Account</p>
          <h1 className="serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#2d2d2d', marginBottom: '0.5rem' }}>Get started today</h1>
          <p className="sans" style={{ fontSize: '0.85rem', color: '#aaa' }}>
            Already have an account?{' '}
            <a href="/auth/login" style={{ color: '#bf4646', textDecoration: 'none', fontWeight: 600 }}>Sign in</a>
          </p>
        </div>

        {/* Role selector */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button type="button" className={`role-btn ${form.role === 'user' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'user' })}>
            <Home size={20} color={form.role === 'user' ? '#bf4646' : '#bbb'} strokeWidth={1.5} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: form.role === 'user' ? '#bf4646' : '#888' }}>I need a Bhai</span>
          </button>
          <button type="button" className={`role-btn ${form.role === 'worker' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'worker' })}>
            <HardHat size={20} color={form.role === 'worker' ? '#bf4646' : '#bbb'} strokeWidth={1.5} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: form.role === 'worker' ? '#bf4646' : '#888' }}>I am a Bhai</span>
          </button>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div style={{ position: 'relative' }}>
            <User size={16} color="#bbb" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="text" name="full_name" placeholder="Full name" value={form.full_name} onChange={handleChange} required className="input-field" />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#bbb" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required className="input-field" />
          </div>

          <div style={{ position: 'relative' }}>
            <Phone size={16} color="#bbb" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input type="tel" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required className="input-field" />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={16} color="#bbb" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password" placeholder="Password" value={form.password}
              onChange={handleChange} required className="input-field"
              style={{ paddingRight: '2.75rem' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              {showPassword ? <EyeOff size={16} color="#bbb" /> : <Eye size={16} color="#bbb" />}
            </button>
          </div>

          {error && (
            <div style={{ background: '#fdf0f0', border: '1px solid #f5c6c6', padding: '0.75rem 1rem', borderRadius: '4px' }}>
              <p className="sans" style={{ fontSize: '0.82rem', color: '#bf4646' }}>{error}</p>
            </div>
          )}

          {form.role === 'worker' && (
            <div style={{ background: '#f0f7f8', border: '1px solid #c5dde0', padding: '0.75rem 1rem', borderRadius: '4px' }}>
              <p className="sans" style={{ fontSize: '0.8rem', color: '#7eacb5', fontWeight: 500 }}>
                After registration you'll set up your worker profile — skills, location & photo.
              </p>
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating account...' : <>Create Account <ArrowRight size={16} /></>}
          </button>

        </form>
      </div>
    </div>
  )
}
