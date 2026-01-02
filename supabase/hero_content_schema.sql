-- =====================================================
-- Hero Content Table Schema
-- Run this to create the hero_content table
-- =====================================================

-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON hero_content FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert" ON hero_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON hero_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON hero_content FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default content
INSERT INTO hero_content (id, title, subtitle, image_url) 
VALUES (
    1,
    '3D & VFX ARTIST PORTFOLIO',
    'By Jules Rukundo | VFX Technical Director',
    ''
)
ON CONFLICT (id) DO NOTHING;
