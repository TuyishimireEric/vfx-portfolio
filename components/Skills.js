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

const OP_FILTERS = ['ALL', 'SOPs', 'DOPs', 'VOPs', 'POPs', 'ROPs', 'TOPs', 'LOPs'];

const SKILL_OP_MAP = {
    pyro: ['DOPs', 'SOPs', 'VOPs'],
    rbd: ['DOPs', 'SOPs'],
    flip: ['DOPs', 'SOPs'],
    particles: ['POPs', 'SOPs', 'DOPs'],
    vellum: ['SOPs', 'DOPs'],
    crowds: ['DOPs', 'SOPs', 'TOPs'],
    karma: ['LOPs', 'ROPs'],
    comp: ['ROPs', 'VOPs', 'SOPs'],
};

export default function Skills() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [skills, setSkills] = useState(defaultSkills);
    const [loading, setLoading] = useState(true);
    const [editingSkill, setEditingSkill] = useState(null);
    const [skillForm, setSkillForm] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [highlightedSkillId, setHighlightedSkillId] = useState(null);

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
    useEffect(() => {
        const handleSelectSkill = (e) => {
            const { skillId, op } = e.detail || {};
            if (op && OP_FILTERS.includes(op)) {
                setActiveFilter(op);
            } else if (skillId && SKILL_OP_MAP[skillId]) {
                const primaryOp = SKILL_OP_MAP[skillId][0];
                setActiveFilter(primaryOp);
            }
            if (skillId) {
                setHighlightedSkillId(skillId);
                setTimeout(() => {
                    setHighlightedSkillId(null);
                }, 3500);
            }
        };

        window.addEventListener('vfx:select-skill', handleSelectSkill);
        return () => window.removeEventListener('vfx:select-skill', handleSelectSkill);
    }, []);

    const filteredSkills = skills.filter((skill) => {
        if (activeFilter === 'ALL') return true;
        const ops = skill.ops || SKILL_OP_MAP[skill.id] || [];
        return (
            ops.includes(activeFilter) ||
            (skill.title && skill.title.toUpperCase().includes(activeFilter)) ||
            (skill.desc && skill.desc.toUpperCase().includes(activeFilter))
        );
    });

    return (
        <section className={styles.skillsSection} id="skills">
            <div className="container" style={{ position: 'relative' }}>
                <h2 className={styles.sectionTitle}>VFX ARSENAL</h2>

                <div className={styles.houdiniOps} role="toolbar" aria-label="Houdini Op Filters">
                    {OP_FILTERS.map((op) => (
                        <button
                            key={op}
                            type="button"
                            className={`${styles.opBadge} ${activeFilter === op ? styles.activeOpBadge : ''}`}
                            onClick={() => setActiveFilter(activeFilter === op && op !== 'ALL' ? 'ALL' : op)}
                        >
                            {op}
                        </button>
                    ))}
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
                    key={activeFilter}
                >
                    {filteredSkills.map((skill) => (
                        <Link
                            href={`/projects/category/${skill.id}`}
                            key={skill.id}
                            id={`skill-${skill.id}`}
                            className={styles.skillLink}
                        >
                            <motion.div
                                layout
                                className={`${styles.skillCard} ${styles[skill.theme] || styles.cyan} ${highlightedSkillId === skill.id ? styles.highlightedCard : ''}`}
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
                    {filteredSkills.length === 0 && (
                        <div className={styles.emptyFilter}>
                            <p>No skills match the &ldquo;{activeFilter}&rdquo; filter.</p>
                            <button
                                type="button"
                                onClick={() => setActiveFilter('ALL')}
                                className={styles.resetFilterBtn}
                            >
                                Show All Skills
                            </button>
                        </div>
                    )}
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
