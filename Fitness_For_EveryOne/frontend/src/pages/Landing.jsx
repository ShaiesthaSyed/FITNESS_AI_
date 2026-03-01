import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Dumbbell, UtensilsCrossed, Heart, Bot, ArrowRight, Play, Star, ChevronDown } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>

            {/* Minimal Background Gradients */}
            <div style={{
                position: 'absolute', width: '80vw', height: '80vh', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--accent-surface) 0%, transparent 60%)',
                top: '-20%', left: '-10%', pointerEvents: 'none', zIndex: 0
            }} />
            <div style={{
                position: 'absolute', width: '60vw', height: '60vh', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--cyan-glow) 0%, transparent 60%)',
                bottom: '-10%', right: '-10%', pointerEvents: 'none', zIndex: 0
            }} />

            {/* Navbar - Floating Pill Style */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '24px 48px', position: 'relative', zIndex: 10,
                    maxWidth: 1400, margin: '0 auto'
                }}
            >
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: 'var(--accent-gradient)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'white',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}>
                        <Activity size={22} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>FitAI</span>
                </div>

                {/* Pill Navigation */}
                <nav className="pill-nav" style={{ display: 'none' }}>
                    {/* Only showing on desktop, we'll use media queries in CSS if needed, but styling inline for layout */}
                </nav>
                <div className="pill-nav" style={{
                    '@media (max-width: 768px)': { display: 'none' }
                }}>
                    <button className="pill-nav-item active">Home</button>
                    <button className="pill-nav-item">About</button>
                    <button className="pill-nav-item">Programs</button>

                </div>

                {/* Auth Actions */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button onClick={() => navigate('/login')} className="pill-nav-item" style={{ fontWeight: 600 }}>Login</button>
                    <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Join Now</button>
                </div>
            </motion.header>

            {/* Hero Section */}
            <main style={{ maxWidth: 1400, margin: '0 auto', position: 'relative', zIndex: 10, padding: '40px 48px' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr',
                    gap: 60, alignItems: 'center', minHeight: '65vh'
                }}>

                    {/* Left Column - Copy */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        style={{ paddingRight: 20 }}
                    >
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }} className="hero-badge">
                            <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
                            <span>Premium AI Fitness Experience</span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 800,
                            lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.03em',
                            color: 'var(--text-primary)'
                        }}>
                            Train Smarter.<br />
                            <span className="gradient-text">Transform</span> Faster.
                        </h1>

                        <p style={{
                            fontSize: '1.15rem', color: 'var(--text-secondary)',
                            marginBottom: 40, lineHeight: 1.6, maxWidth: 480
                        }}>
                            Experience Apple-quality, AI-personalized workout plans, nutrition intelligence, and recovery care—designed exclusively for your body.
                        </p>

                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => navigate('/register')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 36px', fontSize: '1.05rem' }}>
                                Start Free <ArrowRight size={18} />
                            </button>
                            <button onClick={() => navigate('/login')} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 36px', fontSize: '1.05rem' }}>
                                <Play size={18} fill="currentColor" /> See Demo
                            </button>
                        </div>

                        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', marginLeft: 10 }}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} style={{
                                        width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-secondary)',
                                        border: '2px solid var(--bg-card)', marginLeft: -10,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i + 10}`} alt="user" style={{ width: '100%', height: '100%' }} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>10k+</span> Active users transforming today
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Hero Image Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ position: 'relative', height: '100%', minHeight: 560, display: 'flex', alignItems: 'center' }}
                    >
                        {/* Background panel */}
                        <div style={{
                            position: 'absolute', top: '5%', right: 0, bottom: '5%', left: '10%',
                            background: 'var(--hero-card-bg)', borderRadius: 'var(--radius-2xl)',
                            transform: 'rotate(3deg)', opacity: 0.3, zIndex: 1
                        }} />

                        {/* Main Image Card */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'var(--accent-primary)', borderRadius: 'var(--radius-2xl)',
                            overflow: 'hidden', boxShadow: 'var(--shadow-xl)', zIndex: 2,
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <img
                                src="/hero.png"
                                alt="Athletic workout"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                            />
                            {/* Inner gradient overlay for text readability */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 60%)'
                            }} />

                            {/* Floating Badges Inside Image */}
                            <motion.div
                                className="glass-card float-animation"
                                style={{
                                    position: 'absolute', top: 30, right: 30, padding: '12px 20px',
                                    display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.15)',
                                    borderColor: 'rgba(255,255,255,0.2)', color: 'white'
                                }}
                            >
                                <div style={{ background: 'var(--color-success)', width: 8, height: 8, borderRadius: '50%' }} />
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Optimal Form Detected</span>
                            </motion.div>

                            <motion.div
                                className="glass-card float-animation-slow"
                                style={{
                                    position: 'absolute', bottom: 40, left: 30, padding: 20,
                                    background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.2)',
                                    color: 'white', maxWidth: 220
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Heart Rate</span>
                                    <Heart size={16} color="#ff4757" fill="#ff4757" />
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                                    142 <span style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.8 }}>BPM</span>
                                </div>
                                <div style={{ marginTop: 12, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: '65%', height: '100%', background: 'var(--cyan-primary)' }} />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Modular Cards Grid */}
            <section style={{ maxWidth: 1400, margin: '80px auto 100px', padding: '0 48px', position: 'relative', zIndex: 10 }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
                    '@media (max-width: 1024px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
                    '@media (max-width: 640px)': { gridTemplateColumns: '1fr' }
                }}>

                    {[
                        { title: 'Workout Program', icon: Dumbbell, color: '#eef2ff', iconColor: '#4f46e5', delay: 0.3 },
                        { title: 'AI Training Plan', icon: Bot, color: '#f0fdf4', iconColor: '#16a34a', delay: 0.4 },
                        { title: 'Nutrition Intelligence', icon: UtensilsCrossed, color: '#fffbeb', iconColor: '#d97706', delay: 0.5 },
                        { title: 'Recovery Care', icon: Activity, color: '#fef2f2', iconColor: '#dc2626', delay: 0.6 }
                    ].map((card, idx) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: card.delay }}
                            className="premium-card"
                            style={{
                                background: card.color, border: 'none',
                                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                minHeight: 200
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                    background: 'rgba(255,255,255,0.8)', color: card.iconColor,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                }}>
                                    <card.icon size={24} strokeWidth={2.5} />
                                </div>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%', background: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-secondary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 24, lineHeight: 1.3 }}>
                                {card.title.split(' ')[0]}<br />{card.title.split(' ').slice(1).join(' ')}
                            </h3>
                        </motion.div>
                    ))}
                </div>
            </section>




        </div>
    );
}
