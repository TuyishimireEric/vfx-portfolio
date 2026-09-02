'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Save, X, Loader2 } from 'lucide-react';
import { about as defaultAbout } from '@/lib/content';
import styles from './About.module.css';

export default function About() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [aboutContent, setAboutContent] = useState(defaultAbout);
    const [editForm, setEditForm] = useState({ ...aboutContent });

    useEffect(() => {
        const fetchAboutContent = async () => {
            try {
                const { data, error } = await supabase
                    .from('about_content')
                    .select('*')
                    .single();

                if (data) {
                    const merged = { ...defaultAbout };
                    Object.keys(defaultAbout).forEach((k) => { if (data[k]) merged[k] = data[k]; });
                    setAboutContent(merged);
                }
            } catch (error) {
                // Silent error, use defaults
                console.log('Using default about content');
            } finally {
                setLoading(false);
            }
        };
        fetchAboutContent();
    }, []);

    const handleEdit = () => {
        setEditForm(aboutContent);
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from('about_content')
                .upsert({
                    id: 1,
                    ...editForm,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) {
                console.error('Supabase error details:', error);
                throw new Error(`Database error: ${error.message}\nCode: ${error.code}\nDetails: ${error.details || 'None'}\nHint: ${error.hint || 'Check if you are logged in and the table exists'}`);
            }

            setAboutContent(editForm);
            setIsEditing(false);
            addToast('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating about content:', error);
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <section className={styles.aboutSection} id="about">
            <div className="container" style={{ position: 'relative' }}>
                <h2 className={styles.sectionTitle}>ABOUT ME</h2>

                {isAdmin && (
                    <button onClick={handleEdit} className={styles.editBtn}>
                        <Edit2 size={16} /> Edit Profile
                    </button>
                )}

                <div className={styles.contentGrid}>
                    {/* Profile Image Slot */}
                    <div className={styles.profileColumn}>
                        <div className={styles.profileFrame}>
                            <div className={styles.hologramRing}></div>
                            <div className={styles.profileSlot}>
                                {aboutContent.profile_image_url ? (
                                    <img src={aboutContent.profile_image_url} alt="Jules Rukundo, Houdini FX artist" className={styles.profileImage} />
                                ) : (
                                    <div className={styles.placeholderText}>PROFILE IMG</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className={styles.textColumn}>
                        <div className={styles.glassCard}>
                            <p className={styles.bioText}>{aboutContent.bio1}</p>
                            <p className={styles.bioText}>{aboutContent.bio2}</p>
                        </div>

                        {/* Quick Facts */}
                        <div className={styles.quickFacts}>
                            <h3 className={styles.factsTitle}>QUICK FACTS</h3>
                            <ul className={styles.factsList}>
                                <li className={styles.factItem}>
                                    <span className={styles.factLabel}>Location:</span> {aboutContent.location}
                                </li>
                                <li className={styles.factItem}>
                                    <span className={styles.factLabel}>Studios:</span> {aboutContent.experience}
                                </li>
                                <li className={styles.factItem}>
                                    <span className={styles.factLabel}>Specialty:</span> {aboutContent.specialty}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className={styles.editOverlay}>
                        <div className={styles.editForm}>
                            <div className={styles.editHeader}>
                                <h3>Edit Profile</h3>
                                <button onClick={() => setIsEditing(false)} className={styles.closeBtn}>
                                    <X size={20} />
                                </button>
                            </div>

                            <textarea
                                value={editForm.bio1}
                                onChange={e => setEditForm({ ...editForm, bio1: e.target.value })}
                                placeholder="Bio Paragraph 1"
                                className={styles.editTextarea}
                            />
                            <textarea
                                value={editForm.bio2}
                                onChange={e => setEditForm({ ...editForm, bio2: e.target.value })}
                                placeholder="Bio Paragraph 2"
                                className={styles.editTextarea}
                            />
                            <input
                                value={editForm.location}
                                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                placeholder="Location"
                                className={styles.editInput}
                            />
                            <input
                                value={editForm.experience}
                                onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                                placeholder="Experience"
                                className={styles.editInput}
                            />
                            <input
                                value={editForm.specialty}
                                onChange={e => setEditForm({ ...editForm, specialty: e.target.value })}
                                placeholder="Specialty"
                                className={styles.editInput}
                            />

                            <input
                                value={editForm.profile_image_url}
                                onChange={e => setEditForm({ ...editForm, profile_image_url: e.target.value })}
                                placeholder="Profile Image URL"
                                className={styles.editInput}
                            />

                            <div className={styles.editActions}>
                                <button onClick={handleSave} className={styles.saveBtn} disabled={isSaving}>
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.verticalDivider}></div>
        </section>
    );
}
