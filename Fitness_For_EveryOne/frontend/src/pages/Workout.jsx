import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, X, Activity, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Workout() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [showLogModal, setShowLogModal] = useState(false);
    const [logData, setLogData] = useState({ duration_minutes: 45, intensity: 7, notes: '' });
    const [logging, setLogging] = useState(false);

    useEffect(() => { fetchPlan(); }, []);

    const fetchPlan = async () => {
        try {
            const res = await api.get('/fitness/workout-plan');
            setPlan(res.data);
        } catch (err) { } finally { setLoading(false); }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await api.post('/fitness/generate-workout');
            setPlan(res.data);
            toast.success('New AI workout plan generated!');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to generate plan');
        } finally {
            setGenerating(false);
        }
    };

    const handleLogWorkout = async (e) => {
        e.preventDefault();
        setLogging(true);
        try {
            const payload = {
                duration_minutes: parseInt(logData.duration_minutes),
                intensity: parseInt(logData.intensity),
                notes: logData.notes
            };
            await api.post('/progress/workout', payload);
            toast.success('Workout logged successfully! 💪');
            setShowLogModal(false);
            setLogData({ duration_minutes: 45, intensity: 7, notes: '' });
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to log workout');
        } finally {
            setLogging(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div className="skeleton" style={{ height: 300, flex: 1, minWidth: 300 }} />
                <div className="skeleton" style={{ height: 300, flex: 1, minWidth: 300 }} />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 40 }}>
            <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '12px' } }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-glow)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Dumbbell size={24} strokeWidth={2.5} />
                        </div>
                        Your AI Training Plan
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Personalized exercises adapted to your progression and goals.</p>
                </motion.div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={handleGenerate} disabled={generating} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {generating ? <span className="skeleton" style={{ width: 16, height: 16, borderRadius: '50%' }} /> : <Activity size={18} />}
                        {generating ? 'Optimizing Plan...' : 'Regenerate Plan'}
                    </button>
                    <button onClick={() => setShowLogModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Plus size={18} strokeWidth={2.5} /> Log Workout
                    </button>
                </div>
            </div>

            {!plan ? (
                <div style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-xl)', padding: 60, textAlign: 'center' }}>
                    <Dumbbell size={48} color="var(--text-muted)" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>No Training Plan Active</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>Generate your first AI-powered workout plan based on your current metrics and goals.</p>
                    <button onClick={handleGenerate} disabled={generating} className="btn-primary">
                        {generating ? 'Generating your plan...' : 'Build My Plan'}
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {plan.weekly_plan?.map((day, dIdx) => (
                        <motion.div
                            key={dIdx}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dIdx * 0.1 }}
                            className="premium-card" style={{ padding: 40 }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                                        D{dIdx + 1}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{day.label}</h3>
                                        <p style={{ color: 'var(--accent-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>{day.exercises?.length || 0} Exercises • ~45 min</p>
                                    </div>
                                </div>
                                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Play size={14} /> Start Session
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                                {day.exercises?.map((ex, exIdx) => (
                                    <div key={exIdx} style={{
                                        padding: 24, borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column',
                                        transition: 'all 0.2s ease', cursor: 'pointer'
                                    }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{ex.name}</h4>
                                            <div style={{ background: 'var(--bg-card)', padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}>
                                                {exIdx + 1}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                                            <div style={{ flex: 1, background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Sets</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{ex.sets}</div>
                                            </div>
                                            <div style={{ flex: 1, background: 'var(--bg-card)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Reps</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{ex.reps}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Log Workout Modal */}
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

                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Log Your Workout</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.95rem' }}>Record your session to update the AI intelligence algorithms.</p>

                            <form onSubmit={handleLogWorkout} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Duration (Minutes)</label>
                                    <input type="number" min="1" value={logData.duration_minutes} onChange={e => setLogData({ ...logData, duration_minutes: e.target.value })} className="input-field" required />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Intensity (1-10)</label>
                                    <input type="range" min="1" max="10" value={logData.intensity} onChange={e => setLogData({ ...logData, intensity: e.target.value })} style={{ width: '100%', accentColor: 'var(--accent-primary)', marginBottom: 8 }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                                        <span>Light</span>
                                        <span style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>{logData.intensity}</span>
                                        <span>Max</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Notes (Optional)</label>
                                    <textarea value={logData.notes} onChange={e => setLogData({ ...logData, notes: e.target.value })} className="input-field" placeholder="How did you feel? Any PRs?" style={{ minHeight: 100, resize: 'vertical' }} />
                                </div>
                                <button type="submit" disabled={logging} className="btn-primary" style={{ marginTop: 12, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                    {logging ? 'Logging...' : <>Save Workout <CheckCircle2 size={18} /></>}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
