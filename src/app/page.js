'use client'
import { getUserFromStorage } from '@/lib/getUser'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Zap, Wrench, Hammer, Layers, PaintBucket, TreePalm,
  Wind, Tv, Camera, Flame, Car, Sparkles,
  MapPin, Star, Phone, ShieldCheck, ArrowRight,
  ChevronRight, CheckCircle, Users, Clock
} from 'lucide-react'


export default function LandingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [activeService, setActiveService] = useState(0)

  useEffect(() => {
    const checkUser = async () => {
     

const user = getUserFromStorage()
if (!user) { router.push('/auth/login'); return }
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
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService(prev => (prev + 1) % services.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const services = [
    { Icon: Zap, name: 'Electrician', desc: 'Wiring, fans, switches & motor repairs' },
    { Icon: Wrench, name: 'Plumber', desc: 'Leaks, pipes, tanks & fittings' },
    { Icon: Hammer, name: 'Carpenter', desc: 'Doors, windows, locks & furniture' },
    { Icon: Layers, name: 'Mason', desc: 'Tiles, granite & plastering' },
    { Icon: PaintBucket, name: 'Painter', desc: 'Interior, exterior & waterproofing' },
    { Icon: TreePalm, name: 'Coconut Climber', desc: 'Thenga Kayattam — harvest & cleaning' },
    { Icon: Wind, name: 'AC Technician', desc: 'Servicing, gas filling & installation' },
    { Icon: Tv, name: 'Appliance Repair', desc: 'Fridge, washing machine & oven' },
    { Icon: Camera, name: 'CCTV & Wi-Fi', desc: 'Security cameras & internet setup' },
    { Icon: Flame, name: 'Welder', desc: 'Iron gates, grills & fabrication' },
    { Icon: Car, name: 'Mechanic', desc: 'Doorstep oil change & puncture repair' },
    { Icon: Sparkles, name: 'Deep Cleaning', desc: 'Post-construction & festival cleaning' },
  ]

  const steps = [
    { Icon: MapPin, num: '01', title: 'Find', desc: 'Search by district and town. Browse verified workers near you.' },
    { Icon: Clock, num: '02', title: 'Book', desc: 'Choose a date. Describe the work. Send your request.' },
    { Icon: Phone, num: '03', title: 'Confirm', desc: 'Your Bhai accepts. His number is revealed. Call directly.' },
    { Icon: CheckCircle, num: '04', title: 'Done', desc: 'Work gets done. Pay in hand. Leave a review.' },
  ]

  return (
    <div style={{ background: '#fff4ea', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#2d2d2d', overflowX: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }

        .serif { font-family: 'Playfair Display', serif; }
        .sans { font-family: 'DM Sans', sans-serif; }

        /* Texture overlay */
        .texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' x='0' y='0' fill='%23bf4646' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .btn-red {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #bf4646; color: white;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.85rem; letter-spacing: 0.04em;
          padding: 0.8rem 1.75rem; border: none; cursor: pointer;
          text-decoration: none; transition: all 0.2s;
          border-radius: 2px;
        }
        .btn-red:hover { background: #a83c3c; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(191,70,70,0.3); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: transparent; color: #bf4646;
          font-family: 'DM Sans', sans-serif; font-weight: 600;
          font-size: 0.85rem; letter-spacing: 0.04em;
          padding: 0.8rem 1.75rem; border: 1.5px solid #bf4646;
          cursor: pointer; text-decoration: none; transition: all 0.2s;
          border-radius: 2px;
        }
        .btn-ghost:hover { background: #bf4646; color: white; transform: translateY(-1px); }

        .tag {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #7eacb5;
        }

        .service-row {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.9rem 1.2rem;
          border-bottom: 1px solid #f0e4d6;
          cursor: default;
          transition: background 0.15s;
          border-radius: 4px;
        }
        .service-row:hover { background: #fdf0e4; }
        .service-row.active { background: #bf4646; }
        .service-row.active p { color: white !important; }

        .step-card {
          background: white;
          border: 1px solid #eddcc6;
          padding: 2rem;
          position: relative;
          transition: transform 0.25s, box-shadow 0.25s;
          border-radius: 4px;
        }
        .step-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(191,70,70,0.08); }

        .worker-card {
          background: white;
          border: 1px solid #eddcc6;
          padding: 1.25rem;
          display: flex; align-items: center; gap: 1rem;
          border-radius: 4px;
          transition: box-shadow 0.2s;
        }
        .worker-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        .nav-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,244,234,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #eddcc6;
        }

        .hero-left {
          background: #bf4646;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 8rem 3rem 4rem;
        }

        .hero-right {
          padding: 8rem 3rem 4rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-left { min-height: 60vh; padding: 7rem 1.5rem 3rem; }
          .hero-right { padding: 3rem 1.5rem; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .services-layout { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }

        .marquee-wrap { overflow: hidden; }
        .marquee-track {
          display: flex; gap: 0;
          animation: marquee 30s linear infinite;
          width: max-content;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .dot-pulse {
          width: 8px; height: 8px; border-radius: 50%;
          background: #7eacb5;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .big-number {
          font-family: 'Playfair Display', serif;
          font-size: 8rem; font-weight: 900;
          color: rgba(255,255,255,0.08);
          line-height: 1;
          position: absolute;
          bottom: -1rem; right: -1rem;
          pointer-events: none;
          user-select: none;
        }

        .cross-pattern {
          position: absolute; inset: 0; opacity: 0.06;
          background-image: 
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .review-stars { display: flex; gap: 2px; }

        .floating-badge {
          position: absolute;
          background: white;
          border: 1px solid #eddcc6;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          animation: badge-float 3s ease-in-out infinite;
        }
        @keyframes badge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, #eddcc6 20%, #eddcc6 80%, transparent);
          margin: 0 2rem;
        }
      `}</style>

      {/* Navbar */}
      <nav className="nav-bar">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Image src="/logo.png" alt="Bhai.com" width={110} height={36} style={{ objectFit: 'contain' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="/auth/login" className="sans" style={{ fontSize: '0.85rem', color: '#888', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#bf4646'}
              onMouseOut={e => e.target.style.color = '#888'}>
              Login
            </a>
            <a href="/auth/register" className="btn-red" style={{ padding: '0.6rem 1.25rem' }}>
              Get Started <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero — Split Layout */}
      <section className="hero-grid" style={{ transform: `translateY(${scrollY * 0.03}px)` }}>

        {/* Left — Red panel */}
        <div className="hero-left texture">
          <div className="cross-pattern" />

          {/* Decorative tool icon backdrop */}
          <div style={{ position: 'absolute', top: '8rem', right: '2rem', opacity: 0.08 }}>
            <Wrench size={200} color="white" strokeWidth={0.5} />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <div className="dot-pulse" />
              <span className="sans" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                Kerala&apos;s Service Network
              </span>
            </div>

            <h1 className="serif" style={{ fontSize: 'clamp(2.8rem, 4.5vw, 4rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '2rem' }}>
              Every home<br />
              needs a<br />
              <span style={{ fontStyle: 'italic', color: '#eddcc6' }}>good Bhai.</span>
            </h1>

            <p className="sans" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '340px' }}>
              Trusted, verified workers across 14 districts of Kerala. Book a plumber, carpenter, electrician — or a coconut climber.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', color: '#bf4646', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.04em', padding: '0.8rem 1.75rem', textDecoration: 'none', borderRadius: '2px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)' }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                Find a Bhai <ArrowRight size={14} />
              </a>
              <a href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'white', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.04em', padding: '0.8rem 1.75rem', border: '1.5px solid rgba(255,255,255,0.4)', textDecoration: 'none', borderRadius: '2px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent' }}>
                Join as a Bhai
              </a>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              {[{ num: '14', label: 'Districts' }, { num: '25+', label: 'Services' }, { num: '500+', label: 'Towns' }].map(s => (
                <div key={s.label}>
                  <p className="serif" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>{s.num}</p>
                  <p className="sans" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Services list */}
        <div className="hero-right" style={{ background: '#fff4ea' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p className="tag" style={{ marginBottom: '0.5rem' }}>What we offer</p>
            <h2 className="serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2d2d2d' }}>Available Services</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {services.map((s, i) => (
              <div key={s.name} className={`service-row ${i === activeService ? 'active' : ''}`}
                onMouseEnter={() => setActiveService(i)}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: i === activeService ? 'rgba(255,255,255,0.2)' : '#fff4ea',
                  border: `1px solid ${i === activeService ? 'rgba(255,255,255,0.3)' : '#eddcc6'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.Icon size={16} color={i === activeService ? 'white' : '#bf4646'} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: i === activeService ? 'white' : '#2d2d2d', margin: 0 }}>{s.name}</p>
                  <p className="sans" style={{ fontSize: '0.75rem', color: i === activeService ? 'rgba(255,255,255,0.7)' : '#aaa', margin: 0 }}>{s.desc}</p>
                </div>
                <ChevronRight size={14} color={i === activeService ? 'rgba(255,255,255,0.6)' : '#ccc'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee strip
      <div style={{ background: '#eddcc6', borderTop: '1px solid #e0cdb8', borderBottom: '1px solid #e0cdb8', padding: '0.875rem 0' }}>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...Array(2)].map((_, idx) =>
              services.map(s => (
                <div key={`${s.name}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 2rem', borderRight: '1px solid #d4c4b0' }}>
                  <s.Icon size={12} color='#8a7060' strokeWidth={2} />
                  <span className="sans" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#8a7060', whiteSpace: 'nowrap' }}>{s.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div> */}

      {/* How it works */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="tag" style={{ marginBottom: '0.75rem' }}>Simple process</p>
            <h2 className="serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2d2d2d', lineHeight: 1.1 }}>How it works</h2>
          </div>
          <a href="/auth/register" className="btn-ghost">See all services <ChevronRight size={14} /></a>
        </div>

        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {steps.map((s, i) => (
            <div key={s.num} className="step-card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ width: '40px', height: '40px', background: '#fff4ea', border: '1px solid #eddcc6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.Icon size={18} color='#bf4646' strokeWidth={1.5} />
                </div>
                <span className="serif" style={{ fontSize: '0.75rem', color: '#ddd', fontWeight: 700 }}>{s.num}</span>
              </div>
              <h3 className="serif" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2d2d2d', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p className="sans" style={{ fontSize: '0.82rem', color: '#999', lineHeight: 1.7 }}>{s.desc}</p>
              <span className="big-number">{s.num}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="divider-line" />

      {/* Why bhai.com — horizontal layout */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', alignItems: 'center' }}>

          {/* Left */}
          <div>
            <p className="tag" style={{ marginBottom: '0.75rem' }}>Why bhai.com</p>
            <h2 className="serif" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2d2d2d', lineHeight: 1.2, marginBottom: '1.5rem' }}>
              Built for Kerala.<br />Built for trust.
            </h2>
            <p className="sans" style={{ color: '#888', lineHeight: 1.85, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
              We don&apos;t just list workers — we verify them. Every Bhai on our platform is manually reviewed by our admin team before going live. From Coconut Climbers in Thrissur to Well Cleaners in Kannur, bhai.com understands Kerala like no one else.
            </p>

            {/* Feature rows */}
            {[
              { Icon: ShieldCheck, title: 'Admin Verified', desc: 'Every worker reviewed before going live' },
              { Icon: Phone, title: 'Direct Contact', desc: 'Call your Bhai directly after confirmation' },
              { Icon: Star, title: 'Real Reviews', desc: 'Honest ratings after every completed job' },
              { Icon: Users, title: 'Worker First', desc: 'Workers choose their own jobs and dates' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '36px', height: '36px', background: '#fff4ea', border: '1px solid #eddcc6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <f.Icon size={16} color='#bf4646' strokeWidth={1.5} />
                </div>
                <div>
                  <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', marginBottom: '0.15rem' }}>{f.title}</p>
                  <p className="sans" style={{ fontSize: '0.78rem', color: '#aaa' }}>{f.desc}</p>
                </div>
              </div>
            ))}

            <a href="/auth/register" className="btn-red" style={{ marginTop: '1rem' }}>
              Get Started Free <ArrowRight size={14} />
            </a>
          </div>

          {/* Right — mock worker cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p className="tag" style={{ marginBottom: '0.25rem' }}>Recently approved</p>
            {[
              { name: 'Rajan K.', skill: 'Plumber', town: 'Thrissur', rating: 4.8, jobs: 34 },
              { name: 'Suresh M.', skill: 'Electrician', town: 'Kochi', rating: 4.6, jobs: 21 },
              { name: 'Biju T.', skill: 'Carpenter', town: 'Kozhikode', rating: 4.9, jobs: 57 },
              { name: 'Arun P.', skill: 'Painter', town: 'Kannur', rating: 4.7, jobs: 18 },
            ].map((w, i) => (
              <div key={w.name} className="worker-card">
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: ['#bf4646', '#7eacb5', '#eddcc6', '#2d2d2d'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="sans" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>{w.name[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p className="sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d2d', margin: 0 }}>{w.name}</p>
                  <p className="sans" style={{ fontSize: '0.75rem', color: '#aaa', margin: 0 }}>{w.skill} · {w.town}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                    <Star size={11} color='#bf4646' fill='#bf4646' />
                    <span className="sans" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2d2d2d' }}>{w.rating}</span>
                  </div>
                  <p className="sans" style={{ fontSize: '0.7rem', color: '#bbb', margin: 0 }}>{w.jobs} jobs</p>
                </div>
              </div>
            ))}

            <div style={{ background: '#bf4646', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '4px', marginTop: '0.25rem' }}>
              <p className="sans" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', margin: 0 }}>Want to join as a Bhai?</p>
              <a href="/auth/register" className="sans" style={{ fontSize: '0.75rem', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, opacity: 0.85 }}>
                Register <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: '#2d2d2d', padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '-4rem', top: '-4rem', opacity: 0.04 }}>
          <Hammer size={300} color="white" strokeWidth={0.5} />
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <p className="tag" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Ready to begin</p>
          <h2 className="serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: 1.2 }}>
            Find your Bhai today.
          </h2>
          <p className="sans" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: 1.8 }}>
            No commissions. No hidden charges. Just honest work from honest people across Kerala.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/auth/register" className="btn-red">Find a Bhai <ArrowRight size={14} /></a>
            <a href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.04em', padding: '0.8rem 1.75rem', border: '1.5px solid rgba(255,255,255,0.2)', textDecoration: 'none', borderRadius: '2px', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = 'white' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}>
              Join as a Bhai
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <Image src="/logo.png" alt="Bhai.com" width={90} height={30} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.5 }} />
        <p className="sans" style={{ fontSize: '0.72rem', color: '#555' }}>© 2025 bhai.com — Made with care in Kerala</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Login', 'Register'].map(l => (
            <a key={l} href={`/auth/${l.toLowerCase()}`} className="sans" style={{ fontSize: '0.72rem', color: '#555', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#bbb'}
              onMouseOut={e => e.target.style.color = '#555'}>
              {l}
            </a>
          ))}
        </div>
      </footer>

    </div>
  )
}