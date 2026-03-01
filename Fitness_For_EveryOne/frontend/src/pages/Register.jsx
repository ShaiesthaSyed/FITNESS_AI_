 import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mail, Lock, ChevronRight, User, Weight, Ruler, TrendingUp, HeartPulse, Check } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        age: '',
        gender: '',
        medical_condition: '',
        height_cm: '',
        weight_kg: '',
        fitness_level: 'beginner',
        goal: 'general_fitness'
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const navigate = useNavigate();

    const validateStep1 = () => {
        const errs = {};
        if (!formData.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Valid email is required';
        if (!formData.password) errs.password = 'Password is required';
        else if (formData.password.length < 6) errs.password = 'Min 6 characters';
        if (!formData.full_name.trim()) errs.full_name = 'Name is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep2 = () => {
        const errs = {};
        if (!formData.age) errs.age = 'Required';
        if (!formData.gender) errs.gender = 'Required';
        if (!formData.height_cm) errs.height_cm = 'Required';
        if (!formData.weight_kg) errs.weight_kg = 'Required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => { if (validateStep1()) setStep(2); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;
        setLoading(true);
        setErrors({});
        try {
            await register({
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                age: parseInt(formData.age),
                gender: formData.gender,
                medical_condition: formData.medical_condition,
                height_cm: parseFloat(formData.height_cm),
                weight_kg: parseFloat(formData.weight_kg),
                fitness_level: formData.fitness_level,
                goal: formData.goal
            });
            toast.success('Account created! Welcome to FitAI 🎉');
            navigate('/app/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Registration failed');
            setErrors({ form: err.response?.data?.detail || 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    const updateForm = (field, value) => {
        setFormData(p => ({ ...p, [field]: value }));
        if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
    };

    const inputWrapper = { position: 'relative' };
    const iconStyle = { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };
    const inputCss = { paddingLeft: 46, height: 52 };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <Toaster position="top-center" />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 6%', maxWidth: 700, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Activity size={22} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>FitAI</span>
                    </div>
                    <div>
                        Have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                    <div style={{ flex: 1, height: 4, background: 'var(--accent-primary)' }} />
                    <div style={{ flex: 1, height: 4, background: step === 2 ? 'var(--accent-primary)' : 'var(--border-color)' }} />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card" style={{ padding: 48 }}>
                            <h1>Create your account</h1>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={inputWrapper}>
                                    <User size={18} style={iconStyle} />
                                    <input type="text" value={formData.full_name} onChange={e => updateForm('full_name', e.target.value)} placeholder="Full Name" className="input-field" style={inputCss} />
                                </div>

                                <div style={inputWrapper}>
                                    <Mail size={18} style={iconStyle} />
                                    <input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} placeholder="Email" className="input-field" style={inputCss} />
                                </div>

                                <div style={inputWrapper}>
                                    <Lock size={18} style={iconStyle} />
                                    <input type="password" value={formData.password} onChange={e => updateForm('password', e.target.value)} placeholder="Password" className="input-field" style={inputCss} />
                                </div>

                                <button onClick={nextStep} className="btn-primary" style={{ height: 54 }}>
                                    Continue <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card" style={{ padding: 48 }}>
                            <h1>Personalize FitAI</h1>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <input type="number" placeholder="Age" value={formData.age} onChange={e => updateForm('age', e.target.value)} className="input-field" />
                                    <select value={formData.gender} onChange={e => updateForm('gender', e.target.value)} className="input-field">
                                        <option value="">Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <input type="text" placeholder="Medical Condition (optional)" value={formData.medical_condition} onChange={e => updateForm('medical_condition', e.target.value)} className="input-field" />

                                <div style={{ display: 'flex', gap: 20 }}>
                                    <div style={inputWrapper}>
                                        <Ruler size={18} style={iconStyle} />
                                        <input type="number" placeholder="Height (cm)" value={formData.height_cm} onChange={e => updateForm('height_cm', e.target.value)} className="input-field" style={inputCss} />
                                    </div>

                                    <div style={inputWrapper}>
                                        <Weight size={18} style={iconStyle} />
                                        <input type="number" placeholder="Weight (kg)" value={formData.weight_kg} onChange={e => updateForm('weight_kg', e.target.value)} className="input-field" style={inputCss} />
                                    </div>
                                </div>

                                {/* Fitness Level */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                                    {['beginner', 'intermediate', 'advanced'].map(lvl => (
                                        <div key={lvl} onClick={() => updateForm('fitness_level', lvl)} className="select-card"
                                            style={{ padding: 12, textAlign: 'center', border: formData.fitness_level === lvl ? '2px solid var(--accent-primary)' : '2px solid var(--border-color)', cursor: 'pointer' }}>
                                            {lvl}
                                        </div>
                                    ))}
                                </div>

                                {/* Goal */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {[{ id: 'muscle_gain', label: 'Build Muscle', icon: TrendingUp },
                                    { id: 'fat_loss', label: 'Lose Fat', icon: Activity },
                                    { id: 'general_fitness', label: 'Stay Fit', icon: HeartPulse }].map(g => (
                                        <div key={g.id} onClick={() => updateForm('goal', g.id)} style={{ padding: 12, border: formData.goal === g.id ? '2px solid var(--accent-primary)' : '2px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <g.icon size={16} /> {g.label}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button type="button" onClick={() => setStep(1)} className="btn-secondary">Back</button>
                                    <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
                                        {loading ? 'Creating...' : <>Create Account <Check size={16} /></>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
