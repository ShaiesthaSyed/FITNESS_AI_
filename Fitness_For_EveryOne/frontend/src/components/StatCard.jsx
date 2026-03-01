import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, subtitle, color, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className="stat-card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                    width: 52, height: 52, borderRadius: 'var(--radius-lg)',
                    background: `color-mix(in srgb, ${color} 15%, transparent)`,
                    color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 30%, transparent)`
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        {label}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                            {value}
                        </span>
                        {subtitle && (
                            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                                {subtitle}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Subtle background glow based on the card's accent color */}
            <div style={{
                position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '100%',
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                opacity: 0.04, pointerEvents: 'none', zIndex: 0
            }} />
        </motion.div>
    );
}
