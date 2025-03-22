export interface Person {
  id: string;
  company_id: string;
  name: string;
  role: string;
  email: string;
  certificate_issued_at: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  tier: 'core' | 'premium' | 'platinum';
  created_at: string;
  certificate_issued_at: string | null;
  people: Person[];
}