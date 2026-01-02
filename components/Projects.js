'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Edit2, Save, X, Plus, Loader2 } from 'lucide-react';
import styles from './Projects.module.css';

export default function Projects() {
    const { isAdmin } = useAdmin();
    const { addToast } = useToast();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProject, setEditingProject] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleEditClick = (e, project) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        setEditingProject(project.id);
        setEditForm(project);
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

            setProjects(projects.map(p => p.id === editForm.id ? data[0] : p));
            setEditingProject(null);
            setEditForm(null);
            addToast('Project updated successfully!', 'success');
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
                <h2 className={styles.sectionTitle}>FEATURED WORKS</h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#00d4ff' }}>
                        Loading projects...
                    </div>
                ) : (
                    <div className={styles.projectsGrid}>
                        {projects.map((project) => (
                            <Link href={`/projects/${project.id}`} key={project.id} className={styles.projectCardLink}>
                                <div className={styles.projectCard}>
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
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {editingProject && (
                    <div className={styles.editModalOverlay}>
                        <div className={styles.editForm}>
                            <div className={styles.editHeader}>
                                <h3>Edit Project</h3>
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
