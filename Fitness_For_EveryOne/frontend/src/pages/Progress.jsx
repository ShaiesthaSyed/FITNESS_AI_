import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, Share2, Activity, Filter, RefreshCw } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

export default function Progress() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    useEffect(() => {
        api.get('/progress/analytics')
            .then(res => setAnalytics(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
                <div style={{ display: 'flex', gap: 24 }}>
                    <div className="skeleton" style={{ height: 160, flex: 1, borderRadius: 'var(--radius-xl)' }} />
                    <div className="skeleton" style={{ height: 160, flex: 1, borderRadius: 'var(--radius-xl)' }} />
                    <div className="skeleton" style={{ height: 160, flex: 1, borderRadius: 'var(--radius-xl)' }} />
                </div>
                <div className="skeleton" style={{ height: 400, width: '100%', borderRadius: 'var(--radius-xl)' }} />
            </div>
        );
    }

    const { status_history = [], workout_history = [], streak = {} } = analytics || {};

    // Formatting data for beautiful Recharts
    const chartData = status_history.slice(-14).map(s => ({
        date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fatigue: s.fatigue_level,
        soreness: s.soreness_level,
        sleep: s.sleep_hours
    })).reverse();

    return (
        <div style={{ paddingBottom: 60 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <TrendingUp size={24} strokeWidth={2.5} />
                        </div>
                        Your Progress
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>See how far you've come. Every data point is a step forward.</p>
                </motion.div>

                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Filter size={18} /> Filter
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Share2 size={18} /> Share Report
                    </button>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

                {/* Top Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                    <div className="premium-card" style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Total Workouts</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{workout_history.length || 0}</div>
                        </div>
                    </div>

                    <div className="premium-card" style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Award size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Current Streak</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{streak.current || 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>days</span></div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Best: {streak.best || 0} days</div>
                        </div>
                    </div>
                </div>

                {/* Vitals Overview Chart */}
                <div className="premium-card" style={{ padding: '40px 32px', minHeight: 480 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>Recovery & Fatigue Trends</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--cyan-primary)' }} /> Fatigue
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} /> Soreness
                            </div>
                        </div>
                    </div>

                    {chartData.length > 0 ? (
                        <div style={{ height: 350, width: '100%', marginLeft: -20 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--cyan-primary)" stopOpacity={theme === 'dark' ? 0.3 : 0.15} />
                                            <stop offset="95%" stopColor="var(--cyan-primary)" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSoreness" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={theme === 'dark' ? 0.3 : 0.15} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dx={-10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}
                                        itemStyle={{ fontWeight: 600 }}
                                    />
                                    <Area type="monotone" dataKey="fatigue" stroke="var(--cyan-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorFatigue)" activeDot={{ r: 6, strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="soreness" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSoreness)" activeDot={{ r: 6, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Activity size={48} opacity={0.3} style={{ marginBottom: 16 }} />
                            <p>Not enough data to display trends.</p>
                        </div>
                    )}
                </div>

                {/* Recent Workouts Log Table */}
                <div className="premium-card" style={{ padding: 40 }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 24 }}>Recent Sessions</h2>
                    {workout_history.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Date</th>
                                        <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Duration</th>
                                        <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Intensity</th>
                                        <th style={{ padding: '16px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workout_history.map((w, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '20px 8px', color: 'var(--text-primary)', fontWeight: 600 }}>{new Date(w.date).toLocaleDateString()}</td>
                                            <td style={{ padding: '20px 8px', color: 'var(--text-secondary)' }}>{w.duration_minutes} min</td>
                                            <td style={{ padding: '20px 8px' }}>
                                                <div style={{ display: 'inline-flex', padding: '4px 10px', background: w.intensity > 7 ? 'rgba(239, 68, 68, 0.1)' : w.intensity > 4 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: w.intensity > 7 ? '#ef4444' : w.intensity > 4 ? '#f59e0b' : '#10b981', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
                                                    {w.intensity}/10
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 8px', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w.notes || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No workouts logged yet. Start training!</p>
                    )}
                </div>

            </motion.div>
        </div>
    );
}
