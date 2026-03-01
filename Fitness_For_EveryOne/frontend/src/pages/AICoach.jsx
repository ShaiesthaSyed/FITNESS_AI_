import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, Coffee } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AICoach() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        api.get('/ai/chat/history')
            .then(res => setMessages(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, sending]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setSending(true);

        try {
            const res = await api.post('/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            toast.error('Coach is currently unavailable.');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
                <div className="skeleton" style={{ flex: 1, borderRadius: 'var(--radius-xl)' }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: 900, margin: '0 auto' }}>

            {/* Chat Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: 'var(--shadow-md)' }}>
                    <Bot size={30} strokeWidth={2} />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>FitAI Coach</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginTop: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Online & Ready
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className="glass-panel" style={{
                flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden', boxShadow: 'var(--shadow-sm)', position: 'relative'
            }}>
                {/* Messages Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {messages.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <Sparkles size={48} opacity={0.3} style={{ marginBottom: 16 }} />
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Start a conversation</h3>
                            <p style={{ textAlign: 'center', maxWidth: 300, fontSize: '0.9rem' }}>Ask your AI Coach about substituting exercises, fixing macros, or explaining recovery tips.</p>
                            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {["Why am I so sore today?", "Can I swap rows for pullups?", "Give me a high protein snack idea."].map((prompt, i) => (
                                    <button
                                        key={i} onClick={() => setInput(prompt)}
                                        style={{ padding: '8px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }}
                                style={{ display: 'flex', gap: 16, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
                            >
                                {msg.role !== 'user' && (
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, marginTop: 4 }}>
                                        <Bot size={18} />
                                    </div>
                                )}

                                <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} style={{ fontSize: '0.95rem' }}>
                                    {/* Simple markdown parsing for bold text */}
                                    {/* {msg.content.split('\n').map((line, j) => (
                                        <p key={j} style={{ minHeight: line === '' ? 12 : 'auto', marginBottom: j !== msg.content.split('\n').length - 1 ? 8 : 0 }}>
                                            {line.split(/(\*\*.*?\*\*)/).map((part, k) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return <strong key={k}>{part.slice(2, -2)}</strong>;
                                                }
                                                return part;
                                            })}
                                        </p>
                                    ))} */}
                                    {(() => {
    const lines = msg.content?.split('\n') || [];
    return lines.map((line, j) => (
        <p key={j} style={{ minHeight: line === '' ? 12 : 'auto', marginBottom: j !== lines.length - 1 ? 8 : 0 }}>
            {line.split(/(\*\*.*?\*\*)/).map((part, k) =>
                part.startsWith('**') && part.endsWith('**') ? <strong key={k}>{part.slice(2, -2)}</strong> : part
            )}
        </p>
    ));
})()}
                                </div>
                                

                                {msg.role === 'user' && (
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexShrink: 0, marginTop: 4 }}>
                                        <User size={18} />
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}

                    {sending && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 16, alignSelf: 'flex-start' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                <Bot size={18} />
                            </div>
                            <div className="chat-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 24px' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                                <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }`}</style>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px 32px 32px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                        <input
                            type="text" value={input} onChange={e => setInput(e.target.value)}
                            placeholder="Message FitAI Coach..."
                            style={{
                                flex: 1, padding: '18px 24px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)',
                                background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s'
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.boxShadow = '0 0 0 4px var(--accent-glow)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.boxShadow = 'none'; }}
                            disabled={sending}
                        />
                        <button type="submit" disabled={!input.trim() || sending} style={{
                            width: 56, height: 56, borderRadius: '50%', background: input.trim() && !sending ? 'var(--accent-gradient)' : 'var(--bg-surface)',
                            border: 'none', color: input.trim() && !sending ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s'
                        }}>
                            {sending ? <Loader2 size={24} className="spin" /> : <Send size={24} style={{ marginLeft: 3 }} />}
                        </button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        FitAI Coach intelligently analyzes your data to give personalized advice.
                    </div>
                </div>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
}