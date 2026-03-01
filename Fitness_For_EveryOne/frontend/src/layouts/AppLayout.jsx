import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';

export default function AppLayout() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>

            {/* Global gentle background pattern to give texture */}
            <div style={{
                position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0,
                backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }} />

            {/* Sidebar navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main style={{
                flex: 1, marginLeft: 280, padding: '40px 48px 80px',
                minHeight: '100vh', maxWidth: '100%', position: 'relative', zIndex: 1
            }} className="app-main">

                {/* Framer motion wrapper for smooth page transitions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ maxWidth: 1200, margin: '0 auto' }}
                >
                    <Outlet />
                </motion.div>
            </main>

            <style>{`
                @media (max-width: 1024px) {
                    .app-main { margin-left: 0 !important; padding: 24px 20px 80px !important; padding-top: 96px !important; }
                }
            `}</style>
        </div>
    );
}
