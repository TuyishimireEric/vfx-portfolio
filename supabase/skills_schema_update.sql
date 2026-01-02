-- =====================================================
-- Updated Schema for Skills Table
-- Run this to update your existing skills table
-- =====================================================

-- Drop the old skills table if needed
DROP TABLE IF EXISTS skills CASCADE;

-- Create skills table with correct columns
CREATE TABLE skills (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    desc TEXT,
    icon TEXT,
    theme TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert" ON skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON skills FOR DELETE USING (auth.role() = 'authenticated');
