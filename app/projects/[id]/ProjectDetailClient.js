'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Tag, Mail, ChevronRight } from 'lucide-react';
import { getProject, projects as allProjects, profile } from '@/lib/content';
import styles from './ProjectDetail.module.css';

const youtubeId = (url = '') => {
    const m = url.match(/(?:youtu\.be\/|v=|\/embed\/)([\w-]{11})/);
    return m ? m[1] : null;
};

export default function ProjectDetailClient() {
    const params = useParams();
    const id = params?.id;
    const staticProject = getProject(id);
    const [project, setProject] = useState(staticProject);
    const [loading, setLoading] = useState(!staticProject);

    useEffect(() => {
        if (staticProject || !id) return;
        // Not a built-in project → try Supabase (admin-added projects)
        const fetchProject = async () => {
            try {
                const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
                if (error) throw error;
                setProject(data);
            } catch (error) {
                setProject(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, staticProject]);

    useEffect(() => {
        if (project?.title) document.title = `${project.title} | ${profile.name} — Houdini FX`;
    }, [project]);

    if (loading) {
        return (
            <main className={styles.container}>
                <div style={{ textAlign: 'center', padding: '8rem 2rem', color: '#00d4ff' }}>
                    <div className={styles.spinner}></div>
                    <p>Loading project...</p>
                </div>
            </main>
        );
    }

    if (!project) {
        return (
            <main className={styles.container}>
                <div className={styles.notFound}>
                    <h1>Project Not Found</h1>
                    <Link href="/#work" className={styles.backLink}>
                        <ArrowLeft size={20} /> Back to Work
                    </Link>
                </div>
            </main>
        );
    }

    const ytId = youtubeId(project.video_url || '');
    const isMp4 = project.video_url && /\.(mp4|webm)(\?|$)/i.test(project.video_url);
    const others = allProjects.filter((p) => p.id !== project.id).slice(0, 3);

    return (
        <main className={styles.container}>
            <div className={styles.topBar}>
                <Link href="/#work" className={styles.backLink}>
                    <ArrowLeft size={20} /> Back to Work
                </Link>
            </div>

            <section className={styles.player}>
                {isMp4 ? (
                    <video
                        className={styles.video}
                        src={project.video_url}
                        poster={project.image_url || undefined}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : ytId ? (
                    <div className={styles.embed}>
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
                            title={project.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : project.image_url ? (
                    <img className={styles.video} src={project.image_url} alt={project.title} />
                ) : (
                    <div className={styles.placeholder}>PROJECT VISUAL</div>
                )}
            </section>

            <section className={styles.grid}>
                <aside className={styles.sidebar}>
                    <div className={styles.infoBlock}>
                        <h3>Artist</h3>
                        <p>{profile.name} — {profile.role}</p>
                    </div>
                    <div className={styles.infoBlock}>
                        <h3>Tools</h3>
                        <div className={styles.tags}>
                            {(project.tags || []).map((tool, index) => (
                                <span key={index} className={styles.tag}><Tag size={14} />{tool}</span>
                            ))}
                        </div>
                    </div>
                    <div className={styles.infoBlock}>
                        <h3>Need FX like this?</h3>
                        <Link href="/#contact" className={styles.hireBtn}><Mail size={16} /> Get in touch</Link>
                    </div>
                </aside>

                <div>
                    <h1 className={styles.title}>{project.title}</h1>
                    <p className={styles.text}>{project.description}</p>

                    {others.length > 0 && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionHeader}>More Work</h2>
                            <div className={styles.moreGrid}>
                                {others.map((p) => (
                                    <Link key={p.id} href={`/projects/${p.id}`} className={styles.moreCard}>
                                        <img src={p.image_url} alt={p.title} loading="lazy" />
                                        <span>{p.title} <ChevronRight size={14} /></span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
