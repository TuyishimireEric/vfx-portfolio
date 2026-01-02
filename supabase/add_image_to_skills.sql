-- Add image_url column to existing skills table
-- Run this if you already have a skills table

ALTER TABLE skills ADD COLUMN IF NOT EXISTS image_url TEXT;
