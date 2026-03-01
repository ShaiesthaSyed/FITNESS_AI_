import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Moon, Activity, Zap, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Care() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [logData, setLogData] = useState({
        sleep_hours: 8, hydration_ml: 2500, fatigue_level: 3, soreness_level: 2, notes: ''
    });
    const [logging, setLogging] = useState(false);

    useEffect(() => { fetchPlan(); }, []);

    const fetchPlan = async () => {
        try {
            const res = await api.get('/fitness/recovery-plan');
            setPlan(res.data);
        } catch (err) { } finally { setLoading(false); }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await api.post('/fitness/generate-recovery');
            setPlan(res.data);
            toast.success('Recovery protocol updated intelligently! 🧘‍♂️');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to generate');
        } finally {
            setGenerating(false);
        }
    };

    const handleLogStatus = async (e) => {
        e.preventDefault();
        setLogging(true);
        try {
            const payload = {
                sleep_hours: parseFloat(logData.sleep_hours),
                hydration_ml: parseInt(logData.hydration_ml),
                fatigue_level: parseInt(logData.fatigue_level),
                soreness_level: parseInt(logData.soreness_level),
                notes: logData.notes
            };
            await api.post('/progress/daily-status', payload);
            toast.success('Vitals logged! AI is adjusting your recovery.');
            setShowLogModal(false);
            setLogData({ sleep_hours: 8, hydration_ml: 2500, fatigue_level: 3, soreness_level: 2, notes: '' });
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to log status');
        } finally {
            setLogging(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="skeleton" style={{ height: 160, width: '100%', borderRadius: 'var(--radius-xl)' }} />
                <div className="skeleton" style={{ height: 400, width: '100%', borderRadius: 'var(--radius-xl)' }} />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 40 }}>
            <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '12px' } }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={24} strokeWidth={2.5} />
                        </div>
                        Recovery & Vitals
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Resting is training too. Follow your AI recovery protocol.</p>
                </motion.div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleGenerate} disabled={generating} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {generating ? <span className="skeleton" style={{ width: 16, height: 16, borderRadius: '50%' }} /> : <RefreshCw size={18} />}
                        {generating ? 'Calculating...' : 'Update Protocol'}
                    </button>
                    <button onClick={() => setShowLogModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ef4444', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)' }}>
                        <Activity size={18} strokeWidth={2.5} /> Log Vitals
                    </button>
                </div>
            </div>

            {!plan ? (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-2xl)', padding: 60, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>No Recovery Protocol Set</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>Let our AI generate optimal recovery practices based on your workout volume.</p>
                    <button onClick={handleGenerate} disabled={generating} className="btn-primary" style={{ background: '#ef4444' }}>
                        {generating ? 'Processing...' : 'Generate Protocol'}
                    </button>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    {/* Status Overview */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        <div className="premium-card" style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Moon size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Sleep Target</h3>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{plan.sleep_recommendation_hours} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>hrs</span></div>
                            </div>
                        </div>
                        <div className="premium-card" style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Activity size={32} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Today's Focus</h3>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, textTransform: 'capitalize' }}>{plan.rest_type}</div>
                            </div>
                        </div>
                    </div>

                    {/* Practices List */}
                    <div className="premium-card" style={{ padding: 40 }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 32 }}>Recommended Practices</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                            {plan.practices?.map((practice, pIdx) => (
                                <div key={pIdx} style={{
                                    padding: 24, borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-light)', display: 'flex', gap: 16
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', marginTop: 6 }} />
                                        <div style={{ flex: 1, width: 2, background: 'var(--border-color)', borderRadius: 1 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{practice.activity}</h4>
                                        <div style={{ display: 'inline-flex', padding: '4px 10px', background: 'var(--bg-card)', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: 12, border: '1px solid var(--border-light)' }}>
                                            ⏱️ {practice.duration}
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{practice.benefit}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Log Vitals Modal */}
            <AnimatePresence>
                {showLogModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="glass-card" style={{ padding: 40, width: '100%', maxWidth: 480, position: 'relative' }}
                        >
                            <button onClick={() => setShowLogModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-surface)', border: 'none', width: 32, height: 32, borderRadius: '50%', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={18} />
                            </button>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Daily Vitals Log</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>This helps FitAI adapt your training intensity.</p>

                            <form onSubmit={handleLogStatus} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Sleep (Hrs)</label>
                                        <input type="number" step="0.5" min="0" max="24" value={logData.sleep_hours} onChange={e => setLogData({ ...logData, sleep_hours: e.target.value })} className="input-field" required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Water (ml)</label>
                                        <input type="number" step="100" min="0" value={logData.hydration_ml} onChange={e => setLogData({ ...logData, hydration_ml: e.target.value })} className="input-field" required />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Fatigue (1-10)</label>
                                    <input type="range" min="1" max="10" value={logData.fatigue_level} onChange={e => setLogData({ ...logData, fatigue_level: e.target.value })} style={{ width: '100%', accentColor: '#3b82f6', marginBottom: 8 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Soreness (1-10)</label>
                                    <input type="range" min="1" max="10" value={logData.soreness_level} onChange={e => setLogData({ ...logData, soreness_level: e.target.value })} style={{ width: '100%', accentColor: '#ef4444', marginBottom: 8 }} />
                                </div>
                                <button type="submit" disabled={logging} className="btn-primary" style={{ marginTop: 12, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#ef4444', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)' }}>
                                    {logging ? 'Saving...' : <>Log Vitals <CheckCircle2 size={18} /></>}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
