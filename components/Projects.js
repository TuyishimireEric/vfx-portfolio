'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Save, X, Plus, Loader2, Play, ExternalLink } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { projects as defaultProjects, profile } from '@/lib/content';
import styles from './Projects.module.css';

function ProjectCard({ project, isAdmin, onEdit }) {
    const videoRef = useRef(null);
    const play = () => { const v = videoRef.current; if (v) { v.currentTime = 0; v.play().catch(() => { }); } };
    const pause = () => { const v = videoRef.current; if (v) v.pause(); };

    return (
        <Link href={`/projects/${project.id}`} className={styles.projectCardLink}>
            <motion.div
                className={styles.projectCard}
                variants={staggerItem}
                onMouseEnter={play}
                onMouseLeave={pause}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
                {isAdmin && (
                    <button className={styles.editBtn} onClick={(e) => onEdit(e, project)}>
                        <Edit2 size={16} /> Edit
                    </button>
                )}
                <div className={styles.imageContainer}>
                    {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className={styles.projectImageReal} loading="lazy" />
                    ) : (
                        <div className={styles.placeholderImage}>PROJECT RENDER</div>
                    )}
                    {project.video_url && project.video_url.endsWith('.mp4') && (
                        <video
                            ref={videoRef}
                            className={styles.projectVideo}
                            src={project.video_url}
                            muted
                            loop
                            playsInline
                            preload="none"
                        />
                    )}
                    <div className={styles.playBadge}><Play size={14} /> PLAY</div>
                    <div className={styles.overlay}>
                        <div className={styles.projectInfo}>
                            <h3 className={styles.projectTitle}>{project.title}</h3>
                            <p className={styles.projectDesc}>{project.description}</p>
                            <div className={styles.tags}>
                                {(project.tags || []).map(tag => (
                                    <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.cardFrame}>
                    <div className={styles.cornerTL}></div>
                    <div className={styles.cornerBR}></div>
                </div>
            </motion.div>
        </Link>
    );
}

export default function Projects() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [projects, setProjects] = useState(defaultProjects);
    const [editingProject, setEditingProject] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleEditClick = (e, project) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingProject(project.id);
        setEditForm(project);
        setIsAdding(false);
    };

    const handleAddNew = () => {
        setEditForm({ title: '', description: '', image_url: '', video_url: '', tags: [], order_index: projects.length });
        setIsAdding(true);
        setEditingProject('new');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { categories, ...row } = editForm; // categories is a static-only field
            if (typeof row.tags === 'string') row.tags = row.tags.split(',').map(t => t.trim()).filter(Boolean);
            const { data, error } = await supabase
                .from('projects')
                .upsert({ ...row, updated_at: new Date().toISOString() })
                .select();
            if (error) throw new Error(`Database error: ${error.message}\nHint: ${error.hint || 'Check if you are logged in and the table exists'}`);
            if (isAdding) {
                setProjects([...projects, data[0]]);
                addToast('Project added successfully!', 'success');
            } else {
                setProjects(projects.map(p => p.id === editForm.id ? data[0] : p));
                addToast('Project updated successfully!', 'success');
            }
            setEditingProject(null);
            setEditForm(null);
            setIsAdding(false);
        } catch (error) {
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        // Projects saved in Supabase (if any) are shown after the built-in ones
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('order_index', { ascending: true });
                if (error) throw error;
                if (data && data.length > 0) {
                    const ids = new Set(defaultProjects.map(p => p.id));
                    setProjects([...defaultProjects, ...data.filter(p => !ids.has(p.id))]);
                }
            } catch (error) {
                // Supabase not configured — built-in projects already shown
            }
        };
        fetchProjects();
    }, []);

    return (
        <section className={styles.projectsSection} id="work">
            <div className="container">
                <div className={styles.headerSection}>
                    <h2 className={styles.sectionTitle}>FEATURED WORKS</h2>
                    {isAdmin && (
                        <button onClick={handleAddNew} className={styles.addBtn}>
                            <Plus size={16} /> Add New Project
                        </button>
                    )}
                </div>

                <motion.div
                    className={styles.projectsGrid}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.05 }}
                    variants={staggerContainer}
                >
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} isAdmin={isAdmin} onEdit={handleEditClick} />
                    ))}
                </motion.div>

                <div className={styles.reelBanner}>
                    <div className={styles.reelText}>
                        <span className={styles.reelKicker}>FULL SHOWREEL</span>
                        <h3>4 minutes of pyro, destruction, water and particles</h3>
                    </div>
                    <div className={styles.reelEmbed}>
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${profile.showreelId}?rel=0&modestbranding=1`}
                            title={`${profile.name} — VFX Showreel`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                    <a href={profile.showreelUrl} target="_blank" rel="noopener noreferrer" className={styles.reelLink}>
                        Open on YouTube <ExternalLink size={14} />
                    </a>
                </div>

                {editingProject && (
                    <div className={styles.editModalOverlay}>
                        <div className={styles.editForm}>
                            <div className={styles.editHeader}>
                                <h3>{isAdding ? 'Add New Project' : 'Edit Project'}</h3>
                                <button onClick={() => setEditingProject(null)} className={styles.closeBtn}>
                                    <X size={20} />
                                </button>
                            </div>
                            <input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Project Title" className={styles.editInput} />
                            <textarea value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" className={styles.editTextarea} />
                            <input value={editForm.image_url || ''} onChange={e => setEditForm({ ...editForm, image_url: e.target.value })} placeholder="Image / poster URL" className={styles.editInput} />
                            <input value={editForm.video_url || ''} onChange={e => setEditForm({ ...editForm, video_url: e.target.value })} placeholder="Video URL (mp4 or YouTube link)" className={styles.editInput} />
                            <input value={Array.isArray(editForm.tags) ? editForm.tags.join(', ') : (editForm.tags || '')} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} placeholder="Tags (comma separated)" className={styles.editInput} />
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
        </section>
    );
}
