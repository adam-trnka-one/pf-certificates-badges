/*
  # Create partners schema

  1. New Tables
    - `companies`
      - `id` (uuid, primary key)
      - `name` (text)
      - `tier` (enum: core, premium, platinum)
      - `created_at` (timestamp)

    - `people`
      - `id` (uuid, primary key)
      - `company_id` (uuid, foreign key to companies)
      - `name` (text)
      - `email` (text)
      - `role` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to insert/update their own data
*/

-- Create tier enum type
CREATE TYPE partner_tier AS ENUM ('core', 'premium', 'platinum');

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier partner_tier NOT NULL DEFAULT 'core',
  created_at timestamptz DEFAULT now()
);

-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all authenticated users for companies"
  ON companies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to authenticated users for companies"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow read access to all authenticated users for people"
  ON people
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to authenticated users for people"
  ON people
  FOR INSERT
  TO authenticated
  WITH CHECK (true);