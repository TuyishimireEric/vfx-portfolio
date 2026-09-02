'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Save, X, Plus, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { skills as contentSkills, software } from '@/lib/content';
import styles from './Skills.module.css';

const defaultSkills = contentSkills;

export default function Skills() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [skills, setSkills] = useState(defaultSkills);
    const [loading, setLoading] = useState(true);
    const [editingSkill, setEditingSkill] = useState(null);
    const [skillForm, setSkillForm] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data, error } = await supabase
                    .from('skills')
                    .select('*')
                    .order('id', { ascending: true });

                if (data && data.length > 0) {
                    setSkills(data);
                }
            } catch (error) {
                console.log('Using default skills');
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const handleEditClick = (e, skill) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingSkill(skill.id);
        setSkillForm(skill);
        setIsAdding(false);
    };

    const handleAddClick = () => {
        const newSkill = { id: `new_${Date.now()}`, title: '', desc: '', icon: '✨', theme: 'cyan' };
        setSkillForm(newSkill);
        setIsAdding(true);
        setEditingSkill('new');
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            const { error } = await supabase
                .from('skills')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSkills(skills.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Failed to delete skill');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { ...submitData } = skillForm;
            // Ensure unique ID if adding manually, or rely on form input if we want custom string IDs for routes

            const { data, error } = await supabase
                .from('skills')
                .upsert(submitData)
                .select();

            if (error) {
                console.error('Supabase error details:', error);
                throw new Error(`Database error: ${error.message}\nHint: ${error.hint || 'Check if you are logged in and the table exists'}`);
            }

            if (isAdding) {
                setSkills([...skills, data[0]]);
            } else {
                setSkills(skills.map(s => s.id === skillForm.id ? data[0] : s));
            }

            setEditingSkill(null);
            setSkillForm(null);
            setIsAdding(false);
            addToast('Skill saved successfully!', 'success');
        } catch (error) {
            console.error('Error updating skill:', error);
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <section className={styles.skillsSection} id="skills">
            <div className="container" style={{ position: 'relative' }}>
                <h2 className={styles.sectionTitle}>VFX ARSENAL</h2>

                <div className={styles.houdiniOps}>
                    <div className={styles.opBadge}>SOPs</div>
                    <div className={styles.opBadge}>DOPs</div>
                    <div className={styles.opBadge}>VOPs</div>
                    <div className={styles.opBadge}>POPs</div>
                    <div className={styles.opBadge}>ROPs</div>
                    <div className={styles.opBadge}>TOPs</div>
                    <div className={styles.opBadge}>LOPs</div>
                </div>

                {isAdmin && (
                    <button onClick={handleAddClick} className={styles.addBtn}>
                        <Plus size={16} /> Add Skill
                    </button>
                )}

                <motion.div
                    className={styles.skillsGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    {skills.map((skill) => (
                        <Link href={`/projects/category/${skill.id}`} key={skill.id} className={styles.skillLink}>
                            <motion.div
                                className={`${styles.skillCard} ${styles[skill.theme] || styles.cyan}`}
                                variants={staggerItem}
                                whileHover={{
                                    y: -10,
                                    scale: 1.05,
                                    boxShadow: "0 20px 40px rgba(0, 212, 255, 0.3)",
                                    transition: { duration: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }
                                }}
                            >
                                {isAdmin && (
                                    <div className={styles.adminControls}>
                                        <button onClick={(e) => handleEditClick(e, skill)} className={styles.iconBtn}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={(e) => handleDelete(e, skill.id)} className={`${styles.iconBtn} ${styles.deleteBtn}`}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                                <div className={styles.cardHeader}>
                                    <span className={styles.icon}>{skill.icon}</span>
                                    <h3 className={styles.cardTitle}>{skill.title}</h3>
                                </div>
                                <div className={styles.cardVisual}>
                                    {skill.image_url ? (
                                        <img
                                            src={skill.image_url}
                                            alt={skill.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span className={styles.visualIcon} aria-hidden="true">{skill.icon}</span>
                                    )}
                                </div>
                                <p className={styles.cardDesc}>{skill.desc}</p>
                                <div className={styles.cardBorder}></div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {editingSkill && (
                    <div className={styles.editOverlay}>
                        <div className={styles.editForm}>
                            <div className={styles.editHeader}>
                                <h3>{isAdding ? 'Add Skill' : 'Edit Skill'}</h3>
                                <button onClick={() => setEditingSkill(null)} className={styles.closeBtn}>
                                    <X size={20} />
                                </button>
                            </div>

                            <input
                                value={skillForm.id}
                                onChange={e => setSkillForm({ ...skillForm, id: e.target.value })}
                                placeholder="ID (slug for URL)"
                                className={styles.editInput}
                                disabled={!isAdding}
                            />
                            <input
                                value={skillForm.title}
                                onChange={e => setSkillForm({ ...skillForm, title: e.target.value })}
                                placeholder="Skill Title"
                                className={styles.editInput}
                            />
                            <textarea
                                value={skillForm.desc || ''}
                                onChange={e => setSkillForm({ ...skillForm, desc: e.target.value })}
                                placeholder="Description"
                                className={styles.editTextarea}
                            />
                            <input
                                value={skillForm.icon}
                                onChange={e => setSkillForm({ ...skillForm, icon: e.target.value })}
                                placeholder="Icon (Emoji)"
                                className={styles.editInput}
                            />
                            <input
                                value={skillForm.theme}
                                onChange={e => setSkillForm({ ...skillForm, theme: e.target.value })}
                                placeholder="Theme (orange, red, blue, purple, green, cyan, neonBlue, techGrey, gold)"
                                className={styles.editInput}
                            />
                            <input
                                value={skillForm.image_url || ''}
                                onChange={e => setSkillForm({ ...skillForm, image_url: e.target.value })}
                                placeholder="Image URL (optional)"
                                className={styles.editInput}
                            />

                            <div className={styles.editActions}>
                                <button onClick={handleSave} className={styles.saveBtn} disabled={isSaving}>
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingSkill(null);
                                        setSkillForm(null);
                                        setIsAdding(false);
                                    }}
                                    className={styles.cancelBtn}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.softwareList}>
                    {software.map((tool, i) => (
                        <span key={tool}>{i > 0 && ' • '}<span>{tool}</span></span>
                    ))}
                </div>
            </div>
        </section >
    );
}
