import Link from 'next/link';
import styles from './Category.module.css';

// Mock data - same as in Projects.js but ideally shared
const allProjects = [
    {
        id: 1,
        title: 'NEON DYSTOPIA',
        desc: 'Cyberpunk city destruction sequence featuring large-scale RBD and Pyro simulations.',
        tags: ['RBD', 'Pyro', 'Lighting'],
        image: 'project1.jpg'
    },
    {
        id: 2,
        title: 'ABYSSAL VOID',
        desc: 'Underwater creature animation with complex FLIP fluid interaction and volumetric lighting.',
        tags: ['FLIP', 'Creature FX', 'Compositing'],
        image: 'project2.jpg'
    },
    {
        id: 3,
        title: 'AETHER REALM',
        desc: 'Abstract procedural environment generated using heightfields and particle advection.',
        tags: ['Terrain', 'Particles', 'Lookdev'],
        image: 'project3.jpg'
    }
];

export default function CategoryPage({ params }) {
    const category = params.category.toLowerCase();

    // Simple filter logic
    const filteredProjects = allProjects.filter(project =>
        project.tags.some(tag => tag.toLowerCase().includes(category) || category.includes(tag.toLowerCase()))
    );

    return (
        <main className={styles.container}>
            <Link href="/" className={styles.backLink}>← Back to Home</Link>

            <div className={styles.header}>
                <h1 className={styles.title}>
                    PROJECTS: <span className={styles.highlight}>{category.toUpperCase()}</span>
                </h1>
            </div>

            <div className={styles.grid}>
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <Link href={`/projects/${project.id}`} key={project.id} className={styles.cardLink}>
                            <div className={styles.card}>
                                <div className={styles.placeholder}>
                                    {project.title}
                                </div>
                                <div className={styles.info}>
                                    <h3>{project.title}</h3>
                                    <p>{project.desc}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className={styles.noProjects}>
                        <p>No projects found for this category yet.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
