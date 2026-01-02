-- =====================================================
-- Updated Schema for Services Table
-- Run this to update your existing services table
-- =====================================================

-- Drop the old services table if needed
DROP TABLE IF EXISTS services CASCADE;

-- Create services table with correct columns
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    desc TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON services FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON services FOR DELETE USING (auth.role() = 'authenticated');
