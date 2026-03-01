import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    LayoutDashboard, Dumbbell, UtensilsCrossed, Heart, TrendingUp,
    Bot, Settings, LogOut, Sun, Moon, Menu, X, Activity, UserCircle
} from 'lucide-react';

const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/workout', label: 'Workout Plan', icon: Dumbbell },
    { path: '/app/diet', label: 'Nutrition', icon: UtensilsCrossed },
    { path: '/app/care', label: 'Recovery', icon: Heart },
    { path: '/app/progress', label: 'Progress', icon: TrendingUp },
    { path: '/app/coach', label: 'AI Coach', icon: Bot },
];

export default function Sidebar() {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const fullName = user?.full_name || 'Athlete Profile';

    const SidebarContent = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            padding: '28px 20px', justifyContent: 'space-between',
            background: 'var(--bg-glass-strong)', backdropFilter: 'blur(20px)',
            borderRight: '1px solid var(--border-color)',
        }}>
            {/* Top Section */}
            <div>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48, padding: '0 8px' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-md)',
                        background: 'var(--accent-gradient)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'white',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}>
                        <Activity size={22} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>FitAI</span>
                </div>

                {/* Nav Items */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 12 }}>Menu</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: 14,
                                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                                textDecoration: 'none', fontSize: '0.95rem', fontWeight: isActive ? 600 : 500,
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                                boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            })}
                            className="sidebar-link"
                        >
                            <item.icon size={20} strokeWidth={2} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Mini Profile Card */}
                <NavLink to="/app/settings" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                        background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)', transition: 'background 0.2s',
                        cursor: 'pointer'
                    }} className="sidebar-profile">
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-glow)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserCircle size={22} />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>FitAI Member</div>
                        </div>
                        <Settings size={18} color="var(--text-muted)" />
                    </div>
                </NavLink>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={toggleTheme} title="Toggle Theme" style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px', borderRadius: 'var(--radius-md)',
                        background: 'transparent', border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s ease',
                    }} className="sidebar-action-btn">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button onClick={handleLogout} title="Logout" style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '12px', borderRadius: 'var(--radius-md)',
                        background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)',
                        color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s ease',
                    }} className="sidebar-logout-btn">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header & Toggle */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: 72,
                background: 'var(--bg-glass-strong)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border-color)', zIndex: 1100,
                display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px'
            }} className="mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Activity size={18} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>FitAI</span>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    style={{
                        width: 40, height: 40, borderRadius: 10, background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-primary)',
                    }}
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside style={{ width: 280, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1000 }} className="desktop-sidebar">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 1200, backdropFilter: 'blur(4px)' }}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{ width: 280, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1300, boxShadow: 'var(--shadow-xl)' }}
                        >
                            <button onClick={() => setMobileOpen(false)} style={{
                                position: 'absolute', top: 20, right: 20, background: 'var(--bg-surface)', border: 'none',
                                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--text-secondary)'
                            }}>
                                <X size={18} />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <style>{`
                .sidebar-link:hover:not(.active) { background: var(--bg-surface) !important; color: var(--text-primary) !important; transform: translateX(4px); }
                .sidebar-profile:hover { background: var(--bg-card) !important; border-color: var(--border-color) !important; }
                .sidebar-action-btn:hover { background: var(--bg-surface) !important; color: var(--text-primary) !important; border-color: var(--text-muted) !important; }
                .sidebar-logout-btn:hover { background: #ef4444 !important; color: white !important; }
                
                @media (max-width: 1024px) {
                    .desktop-sidebar { display: none !important; }
                    .mobile-header { display: flex !important; }
                }
            `}</style>
        </>
    );
}
