'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Save, X, Loader2, Play, Mail, MapPin } from 'lucide-react';
import { fadeInUp, fadeInDown, staggerContainer } from '@/lib/animations';
import { hero as defaultHero, profile } from '@/lib/content';
import styles from './Hero.module.css';

export default function Hero() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', subtitle: '', image_url: '', video_url: '' });
    const [heroContent, setHeroContent] = useState(defaultHero);

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
                    // Database values override defaults only when actually filled in
                    setHeroContent({
                        title: data.title || defaultHero.title,
                        subtitle: data.subtitle || defaultHero.subtitle,
                        image_url: data.image_url || defaultHero.image_url,
                        video_url: data.video_url || defaultHero.video_url,
                    });
                }
            } catch (error) {
                // Supabase not configured or empty — defaults already shown
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
            const { error } = await supabase
                .from('hero_content')
                .upsert({ id: 1, ...editForm, updated_at: new Date().toISOString() })
                .select();
            if (error) throw new Error(`Database error: ${error.message}\nHint: ${error.hint || 'Check if you are logged in and the table exists'}`);
            setHeroContent(editForm);
            setIsEditing(false);
            addToast('Hero section updated successfully!', 'success');
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const [first, ...rest] = heroContent.title.split(' ');

    return (
        <section className={styles.heroSection} id="top">
            <div className={styles.heroContainer}>
                <motion.div
                    className={styles.heroContent}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.p className={styles.kicker} variants={fadeInDown}>
                        <MapPin size={14} /> {profile.location} &nbsp;·&nbsp; {profile.availability}
                    </motion.p>
                    <motion.h1 className={styles.heroTitle} variants={fadeInDown}>
                        <span className={styles.glitchText}>{first}</span>{' '}
                        <span className="neon-text-blue">{rest.join(' ')}</span>
                    </motion.h1>
                    <motion.p className={styles.heroSubtitle} variants={fadeInUp}>
                        {heroContent.subtitle}
                    </motion.p>
                    <motion.div className={styles.ctaRow} variants={fadeInUp}>
                        <a href={profile.showreelUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
                            <Play size={16} /> Watch Showreel
                        </a>
                        <a href="#work" className={styles.ctaSecondary}>
                            View Work
                        </a>
                        <a href="#contact" className={styles.ctaSecondary}>
                            <Mail size={16} /> Hire Me
                        </a>
                    </motion.div>
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
                        {heroContent.video_url ? (
                            <video
                                className={styles.heroImage}
                                src={heroContent.video_url}
                                poster={heroContent.image_url || undefined}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                            />
                        ) : heroContent.image_url ? (
                            <img src={heroContent.image_url} alt={`${profile.name} — FX render`} className={styles.heroImage} />
                        ) : (
                            <div className={styles.placeholderOverlay}>
                                <div className={styles.scanline}></div>
                                <span>HERO RENDER</span>
                            </div>
                        )}
                        <div className={styles.frameLabel}>
                            <span className={styles.frameDot}></span> HOUDINI · POPs · FIREWORKS — LOOP
                        </div>
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
                        <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title (e.g. JULES RUKUNDO)" className={styles.editInput} />
                        <input value={editForm.subtitle} onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })} placeholder="Subtitle" className={styles.editInput} />
                        <input value={editForm.video_url || ''} onChange={e => setEditForm({ ...editForm, video_url: e.target.value })} placeholder="Hero video URL (mp4, optional)" className={styles.editInput} />
                        <input value={editForm.image_url || ''} onChange={e => setEditForm({ ...editForm, image_url: e.target.value })} placeholder="Hero image / poster URL" className={styles.editInput} />
                        <div className={styles.editActions}>
                            <button onClick={handleSave} className={styles.saveBtn} disabled={isSaving}>
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                                <X size={16} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.backgroundGrid}></div>
        </section>
    );
}
