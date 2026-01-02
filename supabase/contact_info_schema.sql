-- =====================================================
-- Contact Info Table Schema
-- Run this to create the contact_info table
-- =====================================================

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
    id INTEGER PRIMARY KEY DEFAULT 1,
    email TEXT,
    phone TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON contact_info FOR SELECT USING (true);

-- Authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert" ON contact_info FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON contact_info FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON contact_info FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default content
INSERT INTO contact_info (id, email, phone) 
VALUES (
    1,
    'contact@julesrukundo.com',
    '+1 (555) 123-4567'
)
ON CONFLICT (id) DO NOTHING;
