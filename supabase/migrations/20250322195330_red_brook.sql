/*
  # Add certificate issue date tracking

  1. Changes
    - Add `certificate_issued_at` column to companies table
    - Add `certificate_issued_at` column to people table
    
  2. Purpose
    - Track when certificates were last issued for companies and people
    - Enable certificate renewal tracking
*/

-- Add certificate_issued_at to companies
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS certificate_issued_at timestamptz;

-- Add certificate_issued_at to people
ALTER TABLE people 
ADD COLUMN IF NOT EXISTS certificate_issued_at timestamptz;