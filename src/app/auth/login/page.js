'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) { setError(error.message); setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).single()

    if (!profile) { router.push('/auth/register'); return }
    if (profile.role === 'admin') router.push('/admin/dashboard')
    else if (profile.role === 'worker') router.push('/worker/dashboard')
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
        @media (max-width: 768px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .left-panel { display: none !important; }
        }
      `}</style>

      {/* Left panel */}
      <div style={{ background: '#bf4646', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', right: '-3rem', opacity: 0.07 }}>
          <Lock size={280} color="white" strokeWidth={0.5} />
        </div>

        <Image src="/logo.png" alt="Bhai.com" width={110} height={36} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', position: 'relative', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="serif" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: '1rem' }}>
            Welcome<br />back.
          </h2>
          <p className="sans" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.8 }}>
            Log in to find workers, manage your bookings, or check your service requests.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Verified workers across Kerala', 'Direct phone contact after booking', 'Honest reviews from real users'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ArrowRight size={10} color="white" />
                </div>
                <p className="sans" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', maxWidth: '480px', width: '100%', margin: '0 auto' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <p className="sans" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.75rem' }}>Login</p>
          <h1 className="serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#2d2d2d', marginBottom: '0.5rem' }}>Sign in to your account</h1>
          <p className="sans" style={{ fontSize: '0.85rem', color: '#aaa' }}>
            Don't have an account?{' '}
            <a href="/auth/register" style={{ color: '#bf4646', textDecoration: 'none', fontWeight: 600 }}>Register here</a>
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#bbb" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={16} color="#bbb" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input-field"
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

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
          </button>

        </form>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eddcc6', textAlign: 'center' }}>
          <p className="sans" style={{ fontSize: '0.8rem', color: '#aaa' }}>
            Are you a worker?{' '}
            <a href="/auth/register" style={{ color: '#7eacb5', textDecoration: 'none', fontWeight: 600 }}>Register as a Bhai</a>
          </p>
        </div>
      </div>
    </div>
  )
}
