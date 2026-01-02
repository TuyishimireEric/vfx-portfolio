'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Save, X, Plus, Loader2 } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import styles from './Projects.module.css';

export default function Projects() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleEditClick = (e, project) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        setEditingProject(project.id);
        setEditForm(project);
        setIsAdding(false);
    };

    const handleAddNew = () => {
        setEditForm({
            title: '',
            description: '',
            image_url: '',
            tags: [],
            order_index: projects.length
        });
        setIsAdding(true);
        setEditingProject('new');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .upsert({
                    ...editForm,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) {
                console.error('Supabase error details:', error);
                throw new Error(`Database error: ${error.message}\nHint: ${error.hint || 'Check if you are logged in and the table exists'}`);
            }

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
            console.error('Error updating project:', error);
            addToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('order_index', { ascending: true });

                if (error) throw error;
                setProjects(data || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section className={styles.projectsSection}>
            <div className="container">
                <div className={styles.headerSection}>
                    <h2 className={styles.sectionTitle}>FEATURED WORKS</h2>
                    {isAdmin && (
                        <button onClick={handleAddNew} className={styles.addBtn}>
                            <Plus size={16} />
                            Add New Project
                        </button>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#00d4ff' }}>
                        Loading projects...
                    </div>
                ) : (
                    <motion.div
                        className={styles.projectsGrid}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                    >
                        {projects.map((project) => (
                            <Link href={`/projects/${project.id}`} key={project.id} className={styles.projectCardLink}>
                                <motion.div
                                    className={styles.projectCard}
                                    variants={staggerItem}
                                    whileHover={{
                                        y: -15,
                                        scale: 1.03,
                                        boxShadow: "0 25px 50px rgba(0, 212, 255, 0.4)",
                                        transition: { duration: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }
                                    }}
                                >
                                    {isAdmin && (
                                        <button
                                            className={styles.editBtn}
                                            onClick={(e) => handleEditClick(e, project)}
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                    )}
                                    <div className={styles.imageContainer}>
                                        {project.image_url ? (
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className={styles.projectImageReal}
                                            />
                                        ) : (
                                            <div className={styles.placeholderImage}>
                                                PROJECT RENDER
                                            </div>
                                        )}
                                        <div className={styles.overlay}>
                                            <div className={styles.projectInfo}>
                                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                                <p className={styles.projectDesc}>{project.description}</p>
                                                <div className={styles.tags}>
                                                    {project.tags.map(tag => (
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
                        ))}
                    </motion.div>
                )}

                {editingProject && (
                    <div className={styles.editModalOverlay}>
                        <div className={styles.editForm}>
                            <div className={styles.editHeader}>
                                <h3>{isAdding ? 'Add New Project' : 'Edit Project'}</h3>
                                <button onClick={() => setEditingProject(null)} className={styles.closeBtn}>
                                    <X size={20} />
                                </button>
                            </div>

                            <input
                                value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                placeholder="Project Title"
                                className={styles.editInput}
                            />
                            <textarea
                                value={editForm.description}
                                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                placeholder="Description"
                                className={styles.editTextarea}
                            />

                            <input
                                value={editForm.image_url}
                                onChange={e => setEditForm({ ...editForm, image_url: e.target.value })}
                                placeholder="Image URL"
                                className={styles.editInput}
                            />
                            {/* Simplified tag editing for now - comma separated? */}
                            {/* For now, just title/desc/image as requested "edit each picture" */}

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
