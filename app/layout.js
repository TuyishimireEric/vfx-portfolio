import './globals.css';
import Nav from '@/components/Nav';
import { AdminProvider } from '@/context/AdminContext';
import { ToastProvider } from '@/context/ToastContext';
import { SITE_URL, profile } from '@/lib/content';

const title = `${profile.name} | ${profile.role}`;
const description = `${profile.name} is a Houdini FX artist in Kigali, Rwanda — pyro, destruction, FLIP fluids, particles and cloth for film, series and advertising. VFX Artist at KiloHills Productions, co-founder of Nova FX Studios. Available for remote freelance.`;

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: ['Jules Rukundo', 'Houdini FX artist', 'VFX artist Rwanda', 'Houdini pyro', 'RBD destruction', 'FLIP fluids', 'Nova FX Studios', 'KiloHills Productions', 'freelance VFX artist', 'Kigali VFX'],
    authors: [{ name: profile.name }],
    creator: profile.name,
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        url: SITE_URL,
        title,
        description,
        siteName: `${profile.name} — FX Portfolio`,
        images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${profile.name} — ${profile.role}` }],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/og-image.jpg'],
    },
    icons: {
        icon: [{ url: '/favicon.ico' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
        apple: '/apple-touch-icon.png',
    },
    robots: { index: true, follow: true },
};

export const viewport = {
    themeColor: '#050505',
    width: 'device-width',
    initialScale: 1,
};

const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description,
    url: SITE_URL,
    image: `${SITE_URL}${profile.photo}`,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Kigali', addressCountry: 'RW' },
    worksFor: { '@type': 'Organization', name: 'KiloHills Productions' },
    knowsAbout: ['SideFX Houdini', 'Pyro FX', 'RBD Destruction', 'FLIP Fluids', 'Particle FX', 'Vellum', 'Nuke Compositing', 'Karma Renderer'],
    sameAs: [
        'https://www.artstation.com/julesruk12',
        'https://www.behance.net/JulesRUK',
        'https://www.youtube.com/@julesRuk',
        'https://www.linkedin.com/in/jules-rukundo-867763270',
        'https://www.instagram.com/julesruk.jr',
    ],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
            </head>
            <body>
                <ToastProvider>
                    <AdminProvider>
                        <Nav />
                        {children}
                    </AdminProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
