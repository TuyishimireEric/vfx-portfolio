// =====================================================
// Site content — single source of truth.
// Every section renders from this file, so the site is
// complete without a database. If Supabase is configured
// and an admin has saved edits there, those override.
// =====================================================

export const SITE_URL = 'https://vfxportfolio-julesrukundo.vercel.app';

export const profile = {
    name: 'Jules Rukundo',
    role: 'Houdini FX Artist',
    tagline: 'Fire · Destruction · Water · Particles',
    availability: 'Available for freelance — remote, UTC+2',
    email: 'julesrukundo12@gmail.com',
    location: 'Kigali, Rwanda',
    photo: '/media/jules-rukundo.jpg',
    showreelId: 'ZlL9bPTwkj8', // YouTube
    showreelUrl: 'https://youtu.be/ZlL9bPTwkj8',
};

export const socials = [
    { label: 'ArtStation', href: 'https://www.artstation.com/julesruk12' },
    { label: 'Behance', href: 'https://www.behance.net/JulesRUK' },
    { label: 'YouTube', href: 'https://www.youtube.com/@julesRuk' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jules-rukundo-867763270' },
    { label: 'Instagram', href: 'https://www.instagram.com/julesruk.jr' },
];

export const hero = {
    title: 'JULES RUKUNDO',
    subtitle: 'Houdini FX Artist — Fire · Destruction · Water · Particles',
    video_url: '/media/hero-loop.mp4',
    image_url: '/media/hero-poster.jpg',
};

export const about = {
    bio1: 'I am an FX artist working in SideFX Houdini and Nuke — pyro, destruction, fluids, particles and cloth. I build simulations that hold up at cinematic scale and integrate cleanly into live-action plates.',
    bio2: 'I am a VFX Artist at KiloHills Productions and co-founder of Nova FX Studios, a VFX vendor studio in Kigali, Rwanda. Our team delivered the visual effects for THE INVASION, a Rwandan sci-fi production. Currently studying Film and Animation at Mount Kigali University.',
    location: 'Kigali, Rwanda · Remote worldwide',
    experience: 'KiloHills Productions · Nova FX Studios',
    specialty: 'Pyro · RBD · FLIP · Particles',
    profile_image_url: '/media/jules-rukundo.jpg',
};

// Skill cards. `id` doubles as the URL slug (/projects/category/<id>)
// and as the category key that projects are tagged with.
export const skills = [
    { id: 'pyro', title: 'Pyro FX', desc: 'Fire, smoke, explosions and volumetrics', icon: '🔥', theme: 'orange', image_url: '/media/smoke-comp-liveaction.jpg' },
    { id: 'rbd', title: 'RBD / Destruction', desc: 'Fracturing, rigid bodies, debris and dust', icon: '💥', theme: 'red', image_url: '/media/car-destruction-rbd.jpg' },
    { id: 'flip', title: 'FLIP Fluids', desc: 'Water, splashes, oceans and whitewater', icon: '🌊', theme: 'blue', image_url: '' },
    { id: 'particles', title: 'Particles / POPs', desc: 'Fireworks, sparks, magic and energy FX', icon: '✨', theme: 'cyan', image_url: '/media/fireworks-particles.jpg' },
    { id: 'vellum', title: 'Vellum Cloth', desc: 'Cloth, flags, soft bodies', icon: '🧵', theme: 'purple', image_url: '/media/flag-cloth-sim.jpg' },
    { id: 'crowds', title: 'Crowd Sim', desc: 'Agent crowds for stadiums, streets and battles', icon: '🏟️', theme: 'green', image_url: '/media/crowd-sim-stadium.jpg' },
    { id: 'karma', title: 'Lighting & Karma', desc: 'Look-dev, lighting and rendering in Solaris', icon: '💡', theme: 'gold', image_url: '/media/magic-particle-burst.jpg' },
    { id: 'comp', title: 'Compositing (Nuke)', desc: 'Integrating CG FX into live-action plates', icon: '🎬', theme: 'techGrey', image_url: '/media/smoke-comp-liveaction.jpg' },
];

export const software = ['Houdini', 'Nuke', 'Karma', 'Solaris / USD', 'Python / VEX'];

// Featured works. `id` is the URL slug (/projects/<id>).
export const projects = [
    {
        id: 'fireworks-particles',
        title: 'Fireworks',
        description: 'Procedural fireworks built in Houdini POPs — launch, burst and trailing sparks, with multiple shell types and colours firing in sequence.',
        image_url: '/media/fireworks-particles.jpg',
        video_url: '/media/fireworks-particles.mp4',
        tags: ['Houdini', 'POPs', 'Particles'],
        categories: ['particles', 'karma'],
        order_index: 0,
    },
    {
        id: 'magic-particle-burst',
        title: 'Magic Particle Burst',
        description: 'A stylised energy burst FX element — layered particle emission with glow and colour, built as a standalone element ready to drop into a comp.',
        image_url: '/media/magic-particle-burst.jpg',
        video_url: '/media/magic-particle-burst.mp4',
        tags: ['Houdini', 'POPs', 'FX Element'],
        categories: ['particles', 'karma'],
        order_index: 1,
    },
    {
        id: 'car-destruction-rbd',
        title: 'Car Destruction',
        description: 'Rigid-body destruction — a pre-fractured vehicle breaking apart on impact, with secondary debris and dust.',
        image_url: '/media/car-destruction-rbd.jpg',
        video_url: '/media/car-destruction-rbd.mp4',
        tags: ['Houdini', 'RBD', 'Destruction'],
        categories: ['rbd'],
        order_index: 2,
    },
    {
        id: 'smoke-comp-liveaction',
        title: 'Smoke — Live-Action Integration',
        description: 'Pyro smoke simulated in Houdini and composited into a live-action plate in Nuke, matched to the plate\'s lighting and camera.',
        image_url: '/media/smoke-comp-liveaction.jpg',
        video_url: '/media/smoke-comp-liveaction.mp4',
        tags: ['Houdini', 'Pyro', 'Nuke'],
        categories: ['pyro', 'comp'],
        order_index: 3,
    },
    {
        id: 'flag-cloth-sim',
        title: 'Flag Cloth Sim',
        description: 'Vellum cloth simulation of a flag in wind, tuned so the fabric reads naturally at full frame.',
        image_url: '/media/flag-cloth-sim.jpg',
        video_url: '/media/flag-cloth-sim.mp4',
        tags: ['Houdini', 'Vellum', 'Cloth'],
        categories: ['vellum'],
        order_index: 4,
    },
    {
        id: 'crowd-sim-stadium',
        title: 'Stadium Sequence — Crowds & Creatures (WIP)',
        description: 'Work-in-progress previz for a stadium sequence: a Houdini crowd simulation filling the pitch with agents, plus creature animation blocking. Viewport playblast — lighting and shading still to come.',
        image_url: '/media/crowd-sim-stadium.jpg',
        video_url: '/media/crowd-sim-stadium.mp4',
        tags: ['Houdini', 'Crowds', 'Previz', 'WIP'],
        categories: ['crowds'],
        order_index: 5,
    },
];

export const services = [
    { id: 1, title: 'Pyro & Explosions', desc: 'Fire, smoke and explosion simulations for cinematic shots, from small practical-style bursts to large-scale events.', icon: '🔥' },
    { id: 2, title: 'RBD Destruction', desc: 'Procedural fracturing and rigid-body dynamics — buildings, vehicles, props — with debris and dust passes.', icon: '💥' },
    { id: 3, title: 'FLIP Fluids & Oceans', desc: 'Water, splashes, oceans and whitewater using Houdini\'s FLIP and ocean toolsets.', icon: '🌊' },
    { id: 4, title: 'Particle & Magic FX', desc: 'Fireworks, sparks, energy and stylised magic elements built in POPs, delivered as comp-ready passes.', icon: '✨' },
    { id: 5, title: 'Cloth & Soft Bodies', desc: 'Vellum cloth, flags, banners and soft-body simulation for hero and background assets.', icon: '🧵' },
    { id: 6, title: 'Lighting & Rendering', desc: 'Look-dev, lighting and rendering of FX in Karma / Solaris with AOVs for compositing.', icon: '💡' },
    { id: 7, title: 'Compositing & Integration', desc: 'Integrating CG effects into live-action footage in Nuke — matching light, grain and camera.', icon: '🎬' },
    { id: 8, title: 'Full-Shot FX Vendor', desc: 'End-to-end FX shots for film, series and advertising through Nova FX Studios, Kigali.', icon: '🎥' },
];

export const contact = {
    email: 'julesrukundo12@gmail.com',
    phone: '',
};

// ---------- helpers ----------
export const getProject = (id) => projects.find((p) => p.id === id) || null;
export const getSkill = (id) => skills.find((s) => s.id === id) || null;
export const getProjectsByCategory = (id) => projects.filter((p) => (p.categories || []).includes(id));
export const isStaticProjectId = (id) => projects.some((p) => p.id === id);
export const isStaticSkillId = (id) => skills.some((s) => s.id === id);
