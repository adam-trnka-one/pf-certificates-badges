/*
  # Remove Row Level Security

  1. Changes
    - Disable RLS on companies table
    - Disable RLS on people table
    - Drop all existing policies

  2. Security
    - Remove all RLS restrictions
    - Allow unrestricted access to tables
*/

-- Drop all policies from companies table
DROP POLICY IF EXISTS "Allow read access to all authenticated users for companies" ON companies;
DROP POLICY IF EXISTS "Allow insert access to authenticated users for companies" ON companies;
DROP POLICY IF EXISTS "Allow update access to authenticated users for companies" ON companies;
DROP POLICY IF EXISTS "Allow delete access to authenticated users for companies" ON companies;

-- Drop all policies from people table
DROP POLICY IF EXISTS "Allow read access to all authenticated users for people" ON people;
DROP POLICY IF EXISTS "Allow insert access to authenticated users for people" ON people;
DROP POLICY IF EXISTS "Allow update access to authenticated users for people" ON people;
DROP POLICY IF EXISTS "Allow delete access to authenticated users for people" ON people;

-- Disable RLS on both tables
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE people DISABLE ROW LEVEL SECURITY;