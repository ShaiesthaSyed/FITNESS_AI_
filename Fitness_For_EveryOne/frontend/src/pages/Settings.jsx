import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Flag, Save, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Settings() {
    const { fetchProfile } = useAuth();
    const [profile, setProfile] = useState({
        full_name: '', height_cm: '', weight_kg: '', fitness_level: '', goal: '', workout_days_per_week: '',
        medical_conditions: '', activity_level: '', diet_type: '', age: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/user/profile').then(res => {
            const data = res.data;
            // Clean nulls to strings/defaults for controlled inputs
            setProfile({
                full_name: data.full_name || '',
                height_cm: data.height_cm || '',
                weight_kg: data.weight_kg || '',
                fitness_level: data.fitness_level || 'beginner',
                goal: data.goal || 'maintain',
                workout_days_per_week: data.workout_days_per_week || 4,
                medical_conditions: data.medical_conditions || '',
                activity_level: data.activity_level || 'moderate',
                diet_type: data.diet_type || 'vegetarian',
                age: data.age || ''
            });
            setLoading(false);
        }).catch((err) => {
            toast.error("Failed to load profile data");
            setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/user/profile', {
                full_name: profile.full_name,
                age: profile.age ? parseInt(profile.age) : null,
                height_cm: profile.height_cm ? parseFloat(profile.height_cm) : null,
                weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
                fitness_level: profile.fitness_level,
                goal: profile.goal,
                activity_level: profile.activity_level,
                diet_type: profile.diet_type,
                workout_days_per_week: parseInt(profile.workout_days_per_week),
                medical_conditions: profile.medical_conditions
            });
            await fetchProfile();
            toast.success('Settings securely updated 🔒');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div className="skeleton" style={{ height: 100, width: '40%', borderRadius: 'var(--radius-lg)' }} />
                <div className="skeleton" style={{ height: 400, width: '100%', borderRadius: 'var(--radius-xl)' }} />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 60, maxWidth: 800, margin: '0 auto' }}>
            <Toaster position="top-center" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', borderRadius: '12px' } }} />

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-surface)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SettingsIcon size={24} strokeWidth={2.5} />
                    </div>
                    Profile Settings
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage your physical attributes and goals for AI tuning.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card" style={{ padding: 48 }}>
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

                    {/* Section 1 */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <User size={20} color="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Personal Details</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div>
                                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Full Name</label>
                                    <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} className="input-field" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Age</label>
                                    <input type="number" name="age" value={profile.age} onChange={handleChange} className="input-field" />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Medical Conditions & Restrictions (Optional)</label>
                                <textarea name="medical_conditions" value={profile.medical_conditions || ''} onChange={handleChange} className="input-field" placeholder="e.g. Gastric problems, peanut allergy, bad lower back..." style={{ minHeight: 80, resize: 'vertical' }} />
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>This helps the AI Coach give safer, personalized advice.</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: 1, background: 'var(--border-light)' }} />

                    {/* Section 2 */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <Activity size={20} color="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Physical Metrics</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Height (cm)</label>
                                <input type="number" name="height_cm" value={profile.height_cm || ''} onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Weight (kg)</label>
                                <input type="number" name="weight_kg" value={profile.weight_kg || ''} onChange={handleChange} className="input-field" />
                            </div>
                        </div>
                    </div>

                    <div style={{ height: 1, background: 'var(--border-light)' }} />

                    {/* Section 3 */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <Flag size={20} color="var(--accent-primary)" />
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI Training Goals</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, '@media (max-width: 600px)': { gridTemplateColumns: '1fr' } }}>
                            <div>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Fitness Level</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="fitness_level" value={profile.fitness_level || ''} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▼</div>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Primary Goal</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="goal" value={profile.goal || ''} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                                        <option value="general_fitness">General Fitness</option>
                                        <option value="muscle_gain">Muscle Gain</option>
                                        <option value="fat_loss">Fat Loss</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▼</div>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Workout Days/Week</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="workout_days_per_week" value={profile.workout_days_per_week} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                                        {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} Days</option>)}
                                    </select>
                                    <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▼</div>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Diet Type</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="diet_type" value={profile.diet_type} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                                        <option value="vegetarian">Vegetarian</option>
                                        <option value="eggetarian">Eggetarian</option>
                                        <option value="non_vegetarian">Non-Vegetarian</option>
                                        <option value="vegan">Vegan</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▼</div>
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>Activity Level</label>
                                <div style={{ position: 'relative' }}>
                                    <select name="activity_level" value={profile.activity_level} onChange={handleChange} className="input-field" style={{ appearance: 'none' }}>
                                        <option value="sedentary">Sedentary</option>
                                        <option value="light">Light</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="active">Active</option>
                                        <option value="very_active">Very Active</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▼</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--accent-surface)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                            Note: Changing your goals will immediately influence new AI plans.
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                        <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '16px 40px', display: 'flex', alignItems: 'center', gap: 10 }}>
                            {saving ? 'Saving...' : <>Save Changes <Save size={18} /></>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
