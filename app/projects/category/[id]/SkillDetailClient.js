'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Sparkles, Play } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { getSkill, getProjectsByCategory, profile } from '@/lib/content';
import styles from './SkillDetail.module.css';

export default function SkillDetailClient() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const staticSkill = getSkill(id);
    const [skill, setSkill] = useState(staticSkill);
    const [projects, setProjects] = useState(staticSkill ? getProjectsByCategory(id) : []);
    const [loading, setLoading] = useState(!staticSkill);

    useEffect(() => {
        if (staticSkill || !id) return;
        // Admin-added skill (not built in) → look it up in Supabase
        const fetchSkill = async () => {
            try {
                const { data, error } = await supabase.from('skills').select('*').eq('id', id).single();
                if (error) throw error;
                setSkill(data);
                const { data: projectsData } = await supabase.from('projects').select('*').limit(6);
                setProjects(projectsData || []);
            } catch (error) {
                setSkill(null);
            } finally {
                setLoading(false);
            }
        };
        fetchSkill();
    }, [id, staticSkill]);

    useEffect(() => {
        if (skill?.title) document.title = `${skill.title} | ${profile.name} — Houdini FX`;
    }, [skill]);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!skill) {
        return (
            <div className={styles.notFound}>
                <h1>Skill Not Found</h1>
                <button onClick={() => router.push('/#skills')} className={styles.backBtn}>
                    <ArrowLeft size={20} /> Back to Skills
                </button>
            </div>
        );
    }

    return (
        <div className={styles.skillPage}>
            <div className="container">
                <Link href="/#skills" className={styles.backBtn}>
                    <ArrowLeft size={20} /> Back to Skills
                </Link>

                <motion.div className={styles.skillHeader} initial="hidden" animate="visible" variants={staggerContainer}>
                    <motion.div className={styles.iconLarge} variants={fadeInUp}>{skill.icon}</motion.div>
                    <motion.h1 className={styles.skillTitle} variants={fadeInUp}>{skill.title}</motion.h1>
                    <motion.p className={styles.skillDescription} variants={fadeInUp}>{skill.desc}</motion.p>
                </motion.div>

                {skill.image_url && (
                    <motion.div className={styles.skillImage} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                        <img src={skill.image_url} alt={skill.title} />
                        <div className={styles.imageOverlay}></div>
                    </motion.div>
                )}

                <div className={styles.relatedSection}>
                    <h2><Sparkles size={24} /> {projects.length > 0 ? 'Work in this category' : 'Work'}</h2>
                    {projects.length > 0 ? (
                        <motion.div className={styles.projectsGrid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                            {projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    className={styles.projectCard}
                                    variants={staggerItem}
                                    whileHover={{ y: -10, scale: 1.03 }}
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                >
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} />
                                    ) : (
                                        <div className={styles.projectPlaceholder}>PROJECT VISUAL</div>
                                    )}
                                    <div className={styles.projectInfo}>
                                        <h3><Play size={14} /> {project.title}</h3>
                                        <p>{project.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <p className={styles.emptyNote}>
                            Examples of this work are in the full showreel —{' '}
                            <a href={profile.showreelUrl} target="_blank" rel="noopener noreferrer">watch it on YouTube</a>, or{' '}
                            <Link href="/#contact">get in touch</Link> for a breakdown.
                        </p>
                    )}
                </div>
            </div>
            <div className={styles.backgroundGrid}></div>
        </div>
    );
}
