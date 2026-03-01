import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Flame, Target, Dumbbell, TrendingUp, Zap, Calendar, Play } from 'lucide-react';
import StatCard from '../components/StatCard';
import SkeletonCard from '../components/SkeletonCard';
import api from '../api/axios';

export default function Dashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [workout, setWorkout] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get('/user/profile').catch(() => ({ data: {} })),
            api.get('/fitness/workout-plan').catch(() => ({ data: null })),
            api.get('/progress/analytics').catch(() => ({ data: {} })),
        ]).then(([p, w, a]) => {
            setProfile(p.data);
            setWorkout(w.data);
            setAnalytics(a.data);
        }).finally(() => setLoading(false));
    }, []);

    const fullName = profile?.full_name || user?.full_name || 'Champion';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    if (loading) {
        return (
            <div>
                <div className="skeleton" style={{ height: 48, width: 340, marginBottom: 40, borderRadius: 'var(--radius-md)' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                    <SkeletonCard height={120} count={4} />
                </div>
            </div>
        );
    }

    const todayPlan = workout?.weekly_plan?.[0];

    return (
        <div>
            {/* Header section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                    {greeting}, <span className="gradient-text">{fullName}</span> 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    Here's your personalized fitness intelligence for today.
                </p>
            </motion.div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 40 }}>
                <StatCard icon={<Flame size={24} strokeWidth={2.5} />} label="Calorie Target" value={profile?.calorie_target || 0} subtitle="kcal" color="#ef4444" delay={0.1} />
                <StatCard icon={<Target size={24} strokeWidth={2.5} />} label="Protein Goal" value={`${profile?.protein_target || 0}g`} subtitle="daily" color="#8b5cf6" delay={0.15} />
                <StatCard icon={<Zap size={24} strokeWidth={2.5} />} label="Your BMI" value={profile?.bmi || '—'} subtitle={profile?.fitness_level || 'unknown'} color="#f59e0b" delay={0.2} />
                <StatCard icon={<TrendingUp size={24} strokeWidth={2.5} />} label="Current Streak" value={analytics?.streak?.current || 0} subtitle={'days active'} color="#10b981" delay={0.25} />
            </div>

            {/* Two Column Layout for Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>

                {/* Left Column: Today's Workout Focus */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card" style={{ padding: 36 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                                <Dumbbell size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Today's Workout</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{todayPlan?.label || 'Rest Day Focus'}</p>
                            </div>
                        </div>
                        {todayPlan && (
                            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Play size={14} fill="white" /> Start
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {todayPlan ? todayPlan.exercises?.slice(0, 5).map((ex, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)',
                                border: '1px solid var(--border-light)'
                            }}>
                                <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>{ex.name}</span>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 6 }}>{ex.sets} Sets</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 6 }}>{ex.reps} Reps</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                                No plan generated. Set up your profile to receive AI plans.
                            </div>
                        )}
                        {todayPlan && todayPlan.exercises?.length > 5 && (
                            <div style={{ textAlign: 'center', marginTop: 8 }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: 600, cursor: 'pointer' }}>
                                    + {todayPlan.exercises.length - 5} additional exercises
                                </span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Right Column: Intelligent Daily Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card" style={{ padding: 36 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <Flame size={24} strokeWidth={2.5} />
                        </div>
                        <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Daily Nutrition Summary</h3>
                    </div>

                    {/* Premium Circular Progress Ring */}
                    <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 20 }}>
                        <div style={{
                            width: 220, height: 220, borderRadius: '50%', margin: '0 auto',
                            background: `conic-gradient(var(--accent-secondary) 0deg, var(--cyan-primary) 260deg, var(--bg-surface) 260deg)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative', boxShadow: 'var(--shadow-lg)'
                        }}>
                            <div style={{
                                width: 170, height: 170, borderRadius: '50%', background: 'var(--bg-card)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                                    {profile?.calorie_target || 0}
                                </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Kcal Goal
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Macros Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                        {[
                            { label: 'Protein', value: `${profile?.protein_target || 0}g`, color: 'var(--accent-secondary)' },
                            { label: 'TDEE', value: `${profile?.tdee || 0}`, color: '#10b981' },
                            { label: 'BMR', value: `${profile?.bmr || 0}`, color: '#f59e0b' },
                        ].map((item) => (
                            <div key={item.label} style={{ textAlign: 'center', padding: '16px 8px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.value}</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .premium-card { padding: 24px !important; }
                }
            `}</style>
        </div>
    );
}
