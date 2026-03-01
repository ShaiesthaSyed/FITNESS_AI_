import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, ArrowRight, AlertCircle, Quote } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';

        if (!password) errs.password = 'Password is required';
        else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setErrors({});
        try {
            await login(email, password);
            toast.success('Welcome back! 💪');
            navigate('/app/dashboard');
        } catch (err) {
            const message = err.response?.data?.detail || 'Login failed. Please try again.';
            if (err.response?.status === 401) {
                setErrors({ form: 'Invalid credentials. Please check your email and password.' });
            } else {
                setErrors({ form: message });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden'
        }}>
            <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: 'var(--bg-card)', color: 'var(--text-primary)' } }} />

            {/* Left Box — Image & Branding */}
            <div style={{
                flex: 1, position: 'relative', display: 'none', '@media (minWidth: 1024px)': { display: 'flex' }
            }} className="auth-hero">
                {/* Embedded hero image or gradient placeholder */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'var(--hero-gradient)', zIndex: 1
                }}>
                    <img src="/recovery.png" alt="Fitness lifestyle" style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'overlay', opacity: 0.8 }} />
                </div>

                {/* Overlay Quote */}
                <div style={{
                    position: 'relative', zIndex: 2, padding: 60, display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-end', height: '100%', color: 'white',
                    background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 60%)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 14, background: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)'
                        }}>
                            <Activity size={24} strokeWidth={2.5} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.4rem' }}>FitAI</span>
                    </div>

                    <Quote size={40} opacity={0.5} style={{ marginBottom: 20 }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
                        Discipline is doing what you hate to do, but doing it like you love it.
                    </h2>
                    <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>— Mike Tyson</p>
                </div>
            </div>

            {/* Right Box — Login Form */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '40px 6% 40px', position: 'relative',
                maxWidth: 640, margin: '0 auto'
            }}>
                {/* Soft gradient orbs behind the form */}
                <div style={{
                    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                    top: '10%', right: '-10%', pointerEvents: 'none', zIndex: 0
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="glass-card"
                    style={{ padding: '48px', position: 'relative', zIndex: 10, width: '100%' }}
                >
                    <div className="mobile-brand" style={{ display: 'none', alignItems: 'center', gap: 10, marginBottom: 40 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Activity size={20} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>FitAI</span>
                    </div>

                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 40 }}>
                        Enter your details to access your dashboard.
                    </p>

                    {errors.form && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{
                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 24,
                            display: 'flex', alignItems: 'flex-start', gap: 10, color: '#ef4444', fontSize: '0.9rem', fontWeight: 500
                        }}>
                            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>{errors.form}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div>
                            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: errors.email ? '#ef4444' : 'var(--text-muted)' }} />
                                <input
                                    type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                                    placeholder="your@email.com" className="input-field"
                                    style={{ paddingLeft: 46, borderColor: errors.email ? '#ef4444' : undefined, height: 52 }}
                                />
                            </div>
                            {errors.email && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 6, fontWeight: 500 }}>{errors.email}</div>}
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Password</label>
                                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>Forgot?</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: errors.password ? '#ef4444' : 'var(--text-muted)' }} />
                                <input
                                    type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                                    placeholder="••••••••" className="input-field"
                                    style={{ paddingLeft: 46, borderColor: errors.password ? '#ef4444' : undefined, height: 52 }}
                                />
                            </div>
                            {errors.password && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 6, fontWeight: 500 }}>{errors.password}</div>}
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{
                            height: 54, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                        }}>
                            {loading ? <span className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%' }} /> : <>Sign In <ArrowRight size={18} strokeWidth={2.5} /></>}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 32, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>
                            Sign up for free
                        </Link>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @media (max-width: 1024px) {
                    .auth-hero { display: none !important; }
                    .mobile-brand { display: flex !important; }
                }
            `}</style>
        </div>
    );
}
