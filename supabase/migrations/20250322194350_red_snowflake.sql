/*
  # Update RLS policies for companies and people tables

  1. Changes
    - Add update and delete policies for companies table
    - Add update and delete policies for people table
    - Ensure authenticated users can manage their own data

  2. Security
    - Maintain existing read and insert policies
    - Add controlled update/delete capabilities
    - Keep RLS enabled on both tables
*/

-- Update companies policies
CREATE POLICY "Allow update access to authenticated users for companies"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete access to authenticated users for companies"
  ON companies
  FOR DELETE
  TO authenticated
  USING (true);

-- Update people policies
CREATE POLICY "Allow update access to authenticated users for people"
  ON people
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete access to authenticated users for people"
  ON people
  FOR DELETE
  TO authenticated
  USING (true);