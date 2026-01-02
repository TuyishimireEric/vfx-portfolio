-- =====================================================
-- VFX Portfolio Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    video_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    level INTEGER DEFAULT 50,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Content Table
CREATE TABLE IF NOT EXISTS hero_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Content Table
CREATE TABLE IF NOT EXISTS about_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('project-images', 'project-images', true),
    ('hero-images', 'hero-images', true),
    ('about-images', 'about-images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_content FOR SELECT USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "Authenticated users can insert" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON services FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON skills FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON hero_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON hero_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON hero_content FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert" ON about_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON about_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON about_content FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Public read access for storage
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id IN ('project-images', 'hero-images', 'about-images'));

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id IN ('project-images', 'hero-images', 'about-images') AND 
    auth.role() = 'authenticated'
);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (
    bucket_id IN ('project-images', 'hero-images', 'about-images') AND 
    auth.role() = 'authenticated'
);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (
    bucket_id IN ('project-images', 'hero-images', 'about-images') AND 
    auth.role() = 'authenticated'
);

-- =====================================================
-- SEED DATA (Optional - for initial content)
-- =====================================================

-- Insert default hero content
INSERT INTO hero_content (title, subtitle) 
VALUES ('3D & VFX ARTIST PORTFOLIO', 'By Jules Rukundo | VFX Technical Director')
ON CONFLICT DO NOTHING;

-- Insert default projects
INSERT INTO projects (title, description, tags, order_index) VALUES
('NEON DYSTOPIA', 'Cyberpunk city destruction sequence featuring large-scale RBD and Pyro simulations.', ARRAY['RBD', 'Pyro', 'Lighting'], 1),
('ABYSSAL VOID', 'Underwater creature animation with complex FLIP fluid interaction and volumetric lighting.', ARRAY['FLIP', 'Creature FX', 'Compositing'], 2),
('AETHER REALM', 'Abstract procedural environment generated using heightfields and particle advection.', ARRAY['Terrain', 'Particles', 'Lookdev'], 3)
ON CONFLICT DO NOTHING;
