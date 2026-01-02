import Link from 'next/link';
import styles from './ProjectDetail.module.css';

// Mock data - in a real app this would come from a database or CMS
const projects = {
  1: {
    title: 'NEON DYSTOPIA',
    desc: 'Cyberpunk city destruction sequence featuring large-scale RBD and Pyro simulations.',
    client: 'Personal Project',
    role: 'FX Lead',
    tools: ['Houdini', 'Nuke', 'Redshift'],
    breakdown: [
      { title: 'The Challenge', text: 'Creating a believable city destruction sequence with thousands of rigid body pieces and interacting smoke simulations.' },
      { title: 'The Solution', text: 'Used a custom Voronoi fracture setup driven by guided curves to control the destruction timing. Pyro sims were up-resed using sparse solvers.' }
    ]
  },
  2: {
    title: 'ABYSSAL VOID',
    desc: 'Underwater creature animation with complex FLIP fluid interaction and volumetric lighting.',
    client: 'Film Studio X',
    role: 'FX Artist',
    tools: ['Houdini', 'Maya', 'Arnold'],
    breakdown: [
      { title: 'Fluid Dynamics', text: 'The creature interaction required a high-resolution FLIP tank with custom viscosity settings for the slime layer.' },
      { title: 'Lighting', text: 'Volumetric caustics were generated using a gobo light setup in Arnold to simulate deep underwater atmosphere.' }
    ]
  },
  3: {
    title: 'AETHER REALM',
    desc: 'Abstract procedural environment generated using heightfields and particle advection.',
    client: 'Game Studio Y',
    role: 'Environment Artist',
    tools: ['Houdini', 'Unreal Engine 5'],
    breakdown: [
      { title: 'Procedural Terrain', text: 'Heightfields were eroded using a custom HDA to simulate aeolian erosion patterns unique to alien landscapes.' },
      { title: 'Real-time Integration', text: 'Assets were optimized for Nanite and Lumen in UE5, maintaining high fidelity at 60fps.' }
    ]
  }
};

export default function ProjectDetail({ params }) {
  const project = projects[params.id];

  if (!project) {
    return <div className={styles.notFound}>Project not found</div>;
  }

  return (
    <main className={styles.container}>
      <Link href="/" className={styles.backLink}>← Back to Home</Link>
      
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.subtitle}>{project.desc}</p>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.placeholder}>HERO SHOT</div>
        </div>
      </section>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <div className={styles.infoBlock}>
            <h3>CLIENT</h3>
            <p>{project.client}</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>ROLE</h3>
            <p>{project.role}</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>TOOLS</h3>
            <div className={styles.tags}>
              {project.tools.map(tool => <span key={tool} className={styles.tag}>{tool}</span>)}
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {project.breakdown.map((section, index) => (
            <div key={index} className={styles.section}>
              <h2 className={styles.sectionHeader}>{section.title}</h2>
              <p className={styles.text}>{section.text}</p>
              <div className={styles.mediaPlaceholder}>
                BREAKDOWN MEDIA {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
