'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const supabase = createClient()
  const router = useRouter()
  const heroRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (!profile) return
      if (profile.role === 'admin') router.push('/admin/dashboard')
      else if (profile.role === 'worker') router.push('/worker/dashboard')
      else router.push('/user/dashboard')
    }
    checkUser()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouse = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  const services = [
    { emoji: '⚡', name: 'Electrician', desc: 'Wiring & repairs' },
    { emoji: '🔧', name: 'Plumber', desc: 'Pipes & fittings' },
    { emoji: '🪚', name: 'Carpenter', desc: 'Wood & furniture' },
    { emoji: '🧱', name: 'Mason', desc: 'Tiles & plastering' },
    { emoji: '🎨', name: 'Painter', desc: 'Walls & metal' },
    { emoji: '🥥', name: 'Coconut Climber', desc: 'Thenga Kayattam' },
    { emoji: '❄️', name: 'AC Technician', desc: 'Service & gas' },
    { emoji: '🌿', name: 'Gardener', desc: 'Plants & lawn' },
    { emoji: '📷', name: 'CCTV Setup', desc: 'Security cameras' },
    { emoji: '🔩', name: 'Welder', desc: 'Gates & grills' },
    { emoji: '🚗', name: 'Mechanic', desc: 'Doorstep service' },
    { emoji: '🧹', name: 'Deep Cleaning', desc: 'Post-construction' },
  ]

  const steps = [
    { num: '01', title: 'Search', desc: 'Find skilled workers in your district and town across Kerala.' },
    { num: '02', title: 'Book', desc: 'Pick a date and describe the work. Send your request.' },
    { num: '03', title: 'Confirm', desc: 'Your Bhai accepts the job on their terms.' },
    { num: '04', title: 'Done', desc: 'Call directly, get it done, pay in hand. Simple.' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden" style={{ fontFamily: "'Georgia', serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .hero-text { font-family: 'Playfair Display', serif; }
        .body-text { font-family: 'DM Sans', sans-serif; }

        .grain {
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.03;
          pointer-events: none;
          z-index: 100;
          animation: grain 0.5s steps(2) infinite;
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(2%, 2%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-2%, 2%); }
          60% { transform: translate(2%, -2%); }
          70% { transform: translate(-1%, -1%); }
          80% { transform: translate(1%, 1%); }
          90% { transform: translate(-2%, 1%); }
        }

        .service-card {
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-4px);
          background: #1a1a1a;
        }

        .step-card {
          transition: transform 0.4s ease;
        }
        .step-card:hover {
          transform: translateY(-6px);
        }

        .glow-line {
          background: linear-gradient(90deg, transparent, #e8621a, transparent);
          height: 1px;
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.05em;
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 500;
        }

        .cta-btn {
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .float-badge {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .marquee-track {
          display: flex;
          gap: 3rem;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="grain" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.95), transparent)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-2">
          <span className="hero-text text-xl font-bold text-[#e8621a]">bhai</span>
          <span className="hero-text text-xl font-bold text-white">.com</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/auth/login" className="nav-link text-gray-400 hover:text-white transition-colors">Login</a>
          <a href="/auth/register" className="cta-btn bg-[#e8621a] text-white px-5 py-2.5 hover:bg-[#d4551a] transition-colors"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Parallax background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute rounded-full"
            style={{
              width: '600px', height: '600px',
              background: 'radial-gradient(circle, rgba(232,98,26,0.12) 0%, transparent 70%)',
              top: '10%', left: '60%',
              transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20 + scrollY * 0.3}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          />
          <div className="absolute rounded-full"
            style={{
              width: '400px', height: '400px',
              background: 'radial-gradient(circle, rgba(232,98,26,0.07) 0%, transparent 70%)',
              top: '50%', left: '10%',
              transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15 + scrollY * 0.2}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'linear-gradient(#e8621a 1px, transparent 1px), linear-gradient(90deg, #e8621a 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-8 pt-24">

          {/* Badge */}
          <div className="float-badge inline-flex items-center gap-2 border border-[#e8621a33] px-4 py-2 mb-10"
            style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e8621a' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8621a] inline-block" style={{ animation: 'pulse 2s infinite' }} />
            Kerala&apos;s Own Service Network
          </div>

          {/* Main headline */}
          <h1 className="hero-text leading-none mb-8"
            style={{
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 900,
              transform: `translateY(${scrollY * 0.15}px)`,
            }}>
            <span className="block text-white">Every home</span>
            <span className="block" style={{ WebkitTextStroke: '1px #e8621a', color: 'transparent' }}>needs a</span>
            <span className="block text-[#e8621a]">Bhai.</span>
          </h1>

          <div className="glow-line w-32 mb-8" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />

          <p className="body-text text-gray-400 text-lg mb-12 max-w-md leading-relaxed"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
            Book trusted local workers across all 14 districts of Kerala. No middlemen. No apps. Just real people, real work.
          </p>

          <div className="flex gap-4 flex-wrap" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
            <a href="/auth/register"
              className="cta-btn inline-flex items-center gap-3 bg-[#e8621a] text-white px-8 py-4 hover:bg-[#d4551a] transition-all hover:gap-4"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}>
              Find a Bhai Now
              <span>→</span>
            </a>
            <a href="/auth/register"
              className="cta-btn inline-flex items-center gap-3 border border-gray-700 text-gray-300 px-8 py-4 hover:border-[#e8621a] hover:text-white transition-all">
              Join as a Bhai
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-20 pt-10 border-t border-gray-800">
            {[
              { num: '14', label: 'Districts' },
              { num: '25+', label: 'Service Types' },
              { num: '500+', label: 'Towns Covered' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="hero-text text-4xl font-bold text-[#e8621a]">{stat.num}</p>
                <p className="body-text text-gray-500 text-sm uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <p className="body-text text-xs uppercase tracking-widest text-gray-500">Scroll</p>
          <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" style={{ animation: 'pulse 2s infinite' }} />
        </div>
      </section>

      {/* Marquee strip */}
      <div className="py-5 border-y border-gray-800 overflow-hidden bg-[#0f0f0f]">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            services.map(s => (
              <span key={`${s.name}-${i}`} className="body-text text-gray-600 text-sm uppercase tracking-widest flex items-center gap-3">
                <span className="text-[#e8621a]">◆</span>
                {s.name}
              </span>
            ))
          ))}
        </div>
      </div>

      {/* Services */}
      <section className="max-w-5xl mx-auto px-8 py-28">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="body-text text-[#e8621a] text-xs uppercase tracking-widest mb-3">What we offer</p>
            <h2 className="hero-text text-5xl font-bold text-white">Services</h2>
          </div>
          <div className="glow-line w-48 mb-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {services.map((s, i) => (
            <div key={s.name} className="service-card bg-[#111] border border-gray-800 p-5 cursor-default"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <span className="text-2xl block mb-3">{s.emoji}</span>
              <p className="body-text text-white font-medium text-sm mb-1">{s.name}</p>
              <p className="body-text text-gray-600 text-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 border-t border-gray-800"
        style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)' }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="mb-16">
            <p className="body-text text-[#e8621a] text-xs uppercase tracking-widest mb-3">The process</p>
            <h2 className="hero-text text-5xl font-bold text-white">How it works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="step-card relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#e8621a33] to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <p className="hero-text text-6xl font-black mb-4"
                    style={{ WebkitTextStroke: '1px #e8621a33', color: 'transparent' }}>
                    {s.num}
                  </p>
                  <h3 className="hero-text text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="body-text text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why bhai.com */}
      <section className="max-w-5xl mx-auto px-8 py-28">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="body-text text-[#e8621a] text-xs uppercase tracking-widest mb-3">Why us</p>
            <h2 className="hero-text text-5xl font-bold text-white mb-6 leading-tight">
              Built for<br />Kerala.
            </h2>
            <p className="body-text text-gray-400 leading-relaxed mb-8">
              From Coconut Climbers in Thrissur to Well Cleaners in Kannur — bhai.com understands Kerala&apos;s unique needs. We connect you with verified local workers who know the land, the language, and the work.
            </p>
            <a href="/auth/register"
              className="cta-btn inline-flex items-center gap-3 bg-[#e8621a] text-white px-8 py-4 hover:bg-[#d4551a] transition-all"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}>
              Start Now →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '✅', title: 'Admin Verified', desc: 'Every worker is manually verified before going live.' },
              { icon: '📞', title: 'Direct Contact', desc: 'Call your Bhai directly. No chat bots, no delays.' },
              { icon: '⭐', title: 'Real Reviews', desc: 'Honest ratings from real customers after each job.' },
              { icon: '🌴', title: 'Kerala First', desc: 'Built specifically for Kerala homes and culture.' },
            ].map(f => (
              <div key={f.title} className="bg-[#111] border border-gray-800 p-5">
                <span className="text-2xl block mb-3">{f.icon}</span>
                <p className="body-text text-white font-medium text-sm mb-1">{f.title}</p>
                <p className="body-text text-gray-600 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-8 mb-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a00, #2a1000)', border: '1px solid #e8621a33' }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'linear-gradient(#e8621a 1px, transparent 1px), linear-gradient(90deg, #e8621a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="hero-text text-4xl font-bold text-white mb-2">Ready to find your Bhai?</h2>
            <p className="body-text text-gray-400">Join Kerala&apos;s most trusted home services platform.</p>
          </div>
          <a href="/auth/register"
            className="cta-btn flex-shrink-0 inline-flex items-center gap-3 bg-[#e8621a] text-white px-10 py-4 hover:bg-[#d4551a] transition-all text-base"
            style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}>
            Get Started Free →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="hero-text text-lg font-bold text-[#e8621a]">bhai</span>
          <span className="hero-text text-lg font-bold text-white">.com</span>
        </div>
        <p className="body-text text-gray-600 text-xs">© 2025 bhai.com — Made with ❤️ in Kerala</p>
        <div className="flex gap-6">
          <a href="/auth/login" className="body-text text-gray-600 hover:text-white text-xs transition-colors uppercase tracking-wider">Login</a>
          <a href="/auth/register" className="body-text text-gray-600 hover:text-white text-xs transition-colors uppercase tracking-wider">Register</a>
        </div>
      </footer>

    </div>
  )
}