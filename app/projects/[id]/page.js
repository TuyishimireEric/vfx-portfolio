import { getProject, profile, SITE_URL } from '@/lib/content';
import ProjectDetailClient from './ProjectDetailClient';

export function generateMetadata({ params }) {
    const project = getProject(params?.id);
    if (!project) {
        return { title: `Project Not Found | ${profile.name}` };
    }
    const title = `${project.title} | ${profile.name} — Houdini FX`;
    const description = project.description;
    const image = project.image_url ? `${SITE_URL}${project.image_url}` : `${SITE_URL}/og-image.jpg`;
    return {
        title,
        description,
        alternates: { canonical: `/projects/${project.id}` },
        openGraph: {
            type: 'article',
            title,
            description,
            url: `${SITE_URL}/projects/${project.id}`,
            images: [{ url: image, width: 1200, height: 630, alt: project.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default function ProjectDetailPage() {
    return <ProjectDetailClient />;
}
