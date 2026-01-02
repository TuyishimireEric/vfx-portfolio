'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import styles from './SkillDetail.module.css';

export default function SkillDetail() {
    const params = useParams();
    const router = useRouter();
    const [skill, setSkill] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkillAndProjects = async () => {
            try {
                // Fetch skill details
                const { data: skillData, error: skillError } = await supabase
                    .from('skills')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (skillError) throw skillError;
                setSkill(skillData);

                // Fetch related projects (you can customize this query)
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('*')
                    .limit(6);

                if (!projectsError) {
                    setProjects(projectsData || []);
                }
            } catch (error) {
                console.error('Error fetching skill:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchSkillAndProjects();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading skill details...</p>
            </div>
        );
    }

    if (!skill) {
        return (
            <div className={styles.notFound}>
                <h1>Skill Not Found</h1>
                <button onClick={() => router.push('/')} className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className={styles.skillPage}>
            <div className="container">
                <button onClick={() => router.push('/')} className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Back to Skills
                </button>

                <motion.div
                    className={styles.skillHeader}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div className={styles.iconLarge} variants={fadeInUp}>
                        {skill.icon}
                    </motion.div>
                    <motion.h1 className={styles.skillTitle} variants={fadeInUp}>
                        {skill.title}
                    </motion.h1>
                    <motion.p className={styles.skillDescription} variants={fadeInUp}>
                        {skill.desc}
                    </motion.p>
                </motion.div>

                {skill.image_url && (
                    <motion.div
                        className={styles.skillImage}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <img src={skill.image_url} alt={skill.title} />
                        <div className={styles.imageOverlay}></div>
                    </motion.div>
                )}

                {projects.length > 0 && (
                    <div className={styles.relatedSection}>
                        <h2>
                            <Sparkles size={24} />
                            Related Projects
                        </h2>
                        <motion.div
                            className={styles.projectsGrid}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            {projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    className={styles.projectCard}
                                    variants={staggerItem}
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    onClick={() => router.push(`/projects/${project.id}`)}
                                >
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} />
                                    ) : (
                                        <div className={styles.projectPlaceholder}>
                                            PROJECT VISUAL
                                        </div>
                                    )}
                                    <div className={styles.projectInfo}>
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                )}
            </div>

            <div className={styles.backgroundGrid}></div>
        </div>
    );
}
