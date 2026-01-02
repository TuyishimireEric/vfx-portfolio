'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Save, X, Loader2 } from 'lucide-react';
import { fadeInUp, fadeInDown, staggerContainer } from '@/lib/animations';
import styles from './Hero.module.css';

export default function Hero() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', subtitle: '', image_url: '' });
    const [heroContent, setHeroContent] = useState({
        title: '3D & VFX ARTIST PORTFOLIO',
        subtitle: 'By Jules Rukundo | VFX Technical Director',
        image_url: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHeroContent = async () => {
            try {
                const { data, error } = await supabase
                    .from('hero_content')
                    .select('*')
                    .limit(1)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data) {
                    setHeroContent({
                        title: data.title || heroContent.title,
                        subtitle: data.subtitle || heroContent.subtitle,
                        image_url: data.image_url || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching hero content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroContent();
    }, []);

    const handleEdit = () => {
        setEditForm(heroContent);
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from('hero_content')
                .upsert({
                    id: 1,
                    ...editForm,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) {
                console.error('Supabase error details:', error);
                throw new Error(`Database error: ${error.message}\nHint: ${error.hint || 'Check if you are logged in and the table exists'}`);
            }

            setHeroContent(editForm);
            setIsEditing(false);
            addToast('Hero section updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating hero content:', error);
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContainer}>
                <motion.div
                    className={styles.heroContent}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <div className={styles.hudRing}></div>
                    <motion.h1 className={styles.heroTitle} variants={fadeInDown}>
                        <span className={styles.glitchText} data-text="3D & VFX">3D & VFX</span>
                        <br />
                        <span className="neon-text-blue">ARTIST PORTFOLIO</span>
                    </motion.h1>
                    <motion.p className={styles.heroSubtitle} variants={fadeInUp}>
                        {heroContent.subtitle}
                    </motion.p>
                </motion.div>

                <div className={styles.heroFrame}>
                    <div className={styles.cornerBracketTopLeft}></div>
                    <div className={styles.cornerBracketTopRight}></div>
                    <div className={styles.cornerBracketBottomLeft}></div>
                    <div className={styles.cornerBracketBottomRight}></div>

                    {isAdmin && (
                        <button onClick={handleEdit} className={styles.editBtn}>
                            <Edit2 size={16} />
                        </button>
                    )}

                    <div className={styles.imageSlot}>
                        {heroContent.image_url ? (
                            <img
                                src={heroContent.image_url}
                                alt="Hero"
                                className={styles.heroImage}
                            />
                        ) : (
                            <div className={styles.placeholderOverlay}>
                                <div className={styles.scanline}></div>
                                <span>HERO RENDER [1920x1080]</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className={styles.editOverlay}>
                    <div className={styles.editForm}>
                        <div className={styles.editHeader}>
                            <h3>Edit Hero Section</h3>
                            <button onClick={() => setIsEditing(false)} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <input
                            value={editForm.subtitle}
                            onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })}
                            placeholder="Subtitle"
                            className={styles.editInput}
                        />
                        <input
                            value={editForm.image_url}
                            onChange={e => setEditForm({ ...editForm, image_url: e.target.value })}
                            placeholder="Hero Image URL"
                            className={styles.editInput}
                        />

                        <div className={styles.editActions}>
                            <button onClick={handleSave} className={styles.saveBtn} disabled={isSaving}>
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className={styles.cancelBtn}
                            >
                                <X size={16} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.backgroundGrid}></div>
            <div className={styles.floatingParticles}></div>
        </section>
    );
}
