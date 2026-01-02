-- =====================================================
-- Projects Table Schema
-- Run this to create the projects table for Featured Works
-- =====================================================

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Insert some default projects (optional)
INSERT INTO projects (title, description, image_url, tags, order_index) 
VALUES 
(
    'Cinematic VFX Breakdown',
    'Advanced particle simulations and dynamic effects for a sci-fi short film',
    '',
    ARRAY['Houdini', 'Nuke', 'After Effects'],
    0
),
(
    'Procedural Environment',
    'Fully procedural city generation with dynamic lighting and weather systems',
    '',
    ARRAY['Houdini', 'Unreal Engine', 'Substance'],
    1
),
(
    'Character FX Reel',
    'Hair, cloth, and muscle simulations for character animation',
    '',
    ARRAY['Maya', 'Houdini', 'ZBrush'],
    2
)
ON CONFLICT (id) DO NOTHING;
