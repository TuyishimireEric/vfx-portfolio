'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import styles from './ProjectDetail.module.css';

export default function ProjectDetail({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className={styles.container}>
        <div style={{ textAlign: 'center', padding: '5rem', color: '#00d4ff' }}>
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
          <button onClick={() => router.push('/')} className={styles.backLink}>
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <button onClick={() => router.push('/')} className={styles.backLink}>
        <ArrowLeft size={20} />
        Back to Projects
      </button>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.subtitle}>{project.description}</p>
          {project.created_at && (
            <div className={styles.metaInfo}>
              <Calendar size={16} />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className={styles.heroImage}>
          {project.image_url ? (
            <img src={project.image_url} alt={project.title} />
          ) : (
            <div className={styles.placeholder}>PROJECT VISUAL</div>
          )}
        </div>
      </section>

      {project.tags && project.tags.length > 0 && (
        <div className={styles.tagsSection}>
          <h3>Technologies Used</h3>
          <div className={styles.tags}>
            {project.tags.map((tool, index) => (
              <span key={index} className={styles.tag}>
                <Tag size={14} />
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
