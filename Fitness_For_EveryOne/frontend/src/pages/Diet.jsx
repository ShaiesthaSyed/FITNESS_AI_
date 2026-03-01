import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, RefreshCw, Flame, Droplets, Leaf, Dumbbell } from 'lucide-react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Diet() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => { fetchPlan(); }, []);

    const fetchPlan = async () => {
        try {
            const res = await api.get('/fitness/diet-plan');
            setPlan(res.data);
        } catch (err) { } finally { setLoading(false); }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await api.post('/fitness/generate-diet');
            setPlan(res.data);
            toast.success('Your AI nutrition plan has been updated! 🥗');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to generate diet plan');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="skeleton" style={{ height: 200, width: '100%', gridColumn: '1 / -1' }} />
                <div className="skeleton" style={{ height: 400, width: '100%' }} />
                <div className="skeleton" style={{ height: 400, width: '100%' }} />
            </div>
        );
    }

    const MacroCard = ({ icon: Icon, label, value, unit, color }) => (
        <div style={{
            background: 'var(--bg-surface)', padding: 24, borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 20,
            position: 'relative', overflow: 'hidden'
        }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: `color-mix(in srgb, ${color} 15%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                <Icon size={28} strokeWidth={2.5} />
            </div>
            <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {value} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>{unit}</span>
                </div>
            </div>
            <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', opacity: 0.05, transform: 'scale(2.5)', color: color }}>
                <Icon size={100} />
            </div>
        </div>
    );

    return (
        <div style={{ paddingBottom: 40 }}>
            <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '12px' } }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--cyan-glow)', color: 'var(--cyan-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UtensilsCrossed size={24} strokeWidth={2.5} />
                        </div>
                        Nutrition Intelligence
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Smart meal plans calibrated for your macro targets.</p>
                </motion.div>

                <button onClick={handleGenerate} disabled={generating} className="btn-cyan" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {generating ? <span className="skeleton" style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} /> : <RefreshCw size={18} strokeWidth={2.5} />}
                    {generating ? 'Calculating Macros...' : 'Regenerate Plan'}
                </button>
            </div>

            {!plan ? (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-2xl)', padding: 60, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <UtensilsCrossed size={48} color="var(--text-muted)" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>No Nutrition Plan Yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>Let our AI calculate your optimal macros and generate a personalized meal plan.</p>
                    <button onClick={handleGenerate} disabled={generating} className="btn-cyan">
                        {generating ? 'Processing Data...' : 'Generate Plan'}
                    </button>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                    {/* Hero Macro Summary */}
                    <div className="premium-card" style={{ padding: 32 }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24, paddingLeft: 8, borderLeft: '4px solid var(--cyan-primary)' }}>Daily Targets</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                            <MacroCard icon={Flame} label="Calories" value={plan.daily_targets?.calories || 0} unit="kcal" color="#ef4444" />
                            <MacroCard icon={Dumbbell} label="Protein" value={plan.daily_targets?.protein || 0} unit="g" color="#3b82f6" />
                            <MacroCard icon={Leaf} label="Carbs" value={plan.daily_targets?.carbs || 0} unit="g" color="#10b981" />
                            <MacroCard icon={Droplets} label="Fats" value={plan.daily_targets?.fats || 0} unit="g" color="#f59e0b" />
                        </div>
                    </div>

                    {/* Meal Plan List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 16 }}>Today's Menu</h2>
                        {plan.meals?.map((meal, mIdx) => (
                            <motion.div
                                key={mIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mIdx * 0.1 }}
                                className="stat-card" style={{ padding: 32, display: 'flex', gap: 32, '@media (max-width: 768px)': { flexDirection: 'column', gap: 20 } }}
                            >
                                <div style={{ width: 140, flexShrink: 0 }}>
                                    <div style={{ display: 'inline-flex', padding: '6px 12px', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
                                        {meal.meal_type}
                                    </div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{meal.calories}</div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Calories</div>
                                </div>

                                <div style={{ flex: 1, borderLeft: '1px solid var(--border-light)', paddingLeft: 32, '@media (max-width: 768px)': { borderLeft: 'none', paddingLeft: 0, borderTop: '1px solid var(--border-light)', paddingTop: 20 } }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{meal.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 20 }}>{meal.description}</p>

                                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', padding: '6px 16px', borderRadius: 'var(--radius-full)' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Protein: <span style={{ color: 'var(--text-primary)' }}>{meal.protein}g</span></span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', padding: '6px 16px', borderRadius: 'var(--radius-full)' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Carbs: <span style={{ color: 'var(--text-primary)' }}>{meal.carbs}g</span></span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', padding: '6px 16px', borderRadius: 'var(--radius-full)' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Fats: <span style={{ color: 'var(--text-primary)' }}>{meal.fats}g</span></span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
