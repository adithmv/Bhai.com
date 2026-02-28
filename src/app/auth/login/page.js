'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

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

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error_description || data.error || 'Login failed'); setLoading(false); return }

    await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })

    const role = data.profile?.role
    if (!role) { router.push('/auth/register'); return }
    if (role === 'admin') router.push('/admin/dashboard')
    else if (role === 'worker') router.push('/worker/dashboard')
    else router.push('/user/dashboard')

  } catch (err) {
    setError('Connection failed. Please try again.')
    setLoading(false)
  }
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
      <div style={{ background: '#bf4646', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <Link href="/" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>
    ← Home
  </Link>
  <Image src="/logo.png" alt="Bhai.com" width={100} height={32} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
  <Link href="/auth/register" className="sans" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 500 }}>
    New user? Register
  </Link>
</div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>

        <div className="card">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <p className="sans" style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7eacb5', marginBottom: '0.5rem' }}>Welcome back</p>
            <h1 className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2d2d2d' }}>Sign in</h1>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div className="input-wrap">
              <span className="input-icon"><Mail size={16} color="#bbb" /></span>
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" />
            </div>

            <div className="input-wrap">
              <span className="input-icon"><Lock size={16} color="#bbb" /></span>
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field" style={{ paddingRight: '2.75rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPassword ? <EyeOff size={16} color="#bbb" /> : <Eye size={16} color="#bbb" />}
              </button>
            </div>

            {error && (
              <div style={{ background: '#fdf0f0', border: '1px solid #f5c6c6', padding: '0.75rem 1rem', borderRadius: '6px' }}>
                <p className="sans" style={{ fontSize: '0.82rem', color: '#bf4646' }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn" style={{ marginTop: '0.5rem' }}>
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>

          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f0e4d6', textAlign: 'center' }}>
            <p className="sans" style={{ fontSize: '0.82rem', color: '#aaa' }}>
              Don&apos;t have an account?{' '}
              <a href="/auth/register" style={{ color: '#bf4646', textDecoration: 'none', fontWeight: 600 }}>Register</a>
            </p>
            <p className="sans" style={{ fontSize: '0.82rem', color: '#aaa', marginTop: '0.5rem' }}>
              Are you a worker?{' '}
              <a href="/auth/register" style={{ color: '#7eacb5', textDecoration: 'none', fontWeight: 600 }}>Join as a Bhai</a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #eddcc6' }}>
        <p className="sans" style={{ fontSize: '0.72rem', color: '#bbb' }}>© 2025 bhai.com — Made with care in Kerala</p>
      </div>

    </div>
  )
}
