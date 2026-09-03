import { getSkill, profile, SITE_URL } from '@/lib/content';
import SkillDetailClient from './SkillDetailClient';

export function generateMetadata({ params }) {
    const skill = getSkill(params?.id);
    if (!skill) {
        return { title: `Skill Not Found | ${profile.name}` };
    }
    const title = `${skill.title} | ${profile.name} — Houdini FX`;
    const description = skill.desc;
    const image = skill.image_url ? `${SITE_URL}${skill.image_url}` : `${SITE_URL}/og-image.jpg`;
    return {
        title,
        description,
        alternates: { canonical: `/projects/category/${skill.id}` },
        openGraph: {
            type: 'website',
            title,
            description,
            url: `${SITE_URL}/projects/category/${skill.id}`,
            images: [{ url: image, width: 1200, height: 630, alt: skill.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    };
}

export default function SkillDetailPage() {
    return <SkillDetailClient />;
}
