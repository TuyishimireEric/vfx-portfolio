import { SITE_URL, projects, skills } from '@/lib/content';

export default function sitemap() {
    const now = new Date();
    return [
        { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 })),
        ...skills.map((s) => ({ url: `${SITE_URL}/projects/category/${s.id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 })),
    ];
}
