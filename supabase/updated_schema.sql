-- =====================================================
-- Updated Schema for About Content
-- Run this to update your existing database
-- =====================================================

-- Drop the old about_content table if it exists
DROP TABLE IF EXISTS about_content CASCADE;

-- Create the new about_content table with correct columns
CREATE TABLE about_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    bio1 TEXT,
    bio2 TEXT,
    location TEXT,
    experience TEXT,
    specialty TEXT,
    profile_image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON about_content FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert" ON about_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON about_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON about_content FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default content
INSERT INTO about_content (id, bio1, bio2, location, experience, specialty, profile_image_url) 
VALUES (
    1,
    'I am a VFX Technical Director specializing in procedural systems and dynamic simulations. With a passion for blending art and code, I create cinematic visual effects that push the boundaries of realism.',
    'My workflow integrates Houdini, Unreal Engine, and custom Python tools to deliver high-end results for film and games.',
    'Remote / Worldwide',
    '5+ Years',
    'Pyro & Destruction',
    ''
)
ON CONFLICT (id) DO NOTHING;
