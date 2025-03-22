import React, { useState, useEffect } from 'react';
import { Building2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Company, Person } from '../../types/partners';
import { CompanyList } from './CompanyList';
import { AddCompanyModal } from './AddCompanyModal';
import { AddPersonModal } from './AddPersonModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { EditCompanyModal } from './EditCompanyModal';
import { EditPersonModal } from './EditPersonModal';
import { CertificateModal } from './CertificateModal';

export function Partners() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState<{
    type: 'personal' | 'company';
    name: string;
    tier: 'core' | 'premium' | 'platinum';
    issueDate: string;
  } | null>(null);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddPerson, setShowAddPerson] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({ tier: 'core', people: [] });
  const [newPerson, setNewPerson] = useState<Partial<Person>>({});
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) throw companiesError;

      const { data: peopleData, error: peopleError } = await supabase
        .from('people')
        .select('*')
        .order('created_at', { ascending: false });

      if (peopleError) throw peopleError;

      const companiesWithPeople = companiesData.map(company => ({
        ...company,
        people: peopleData.filter(person => person.company_id === company.id) || []
      }));

      setCompanies(companiesWithPeople);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleCompany = (companyId: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId);
    } else {
      newExpanded.add(companyId);
    }
    setExpandedCompanies(newExpanded);
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: newCompany.name,
          tier: newCompany.tier
        })
        .select()
        .single();

      if (error) throw error;

      setCompanies(prev => [{ ...data, people: [] }, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add company');
    }

    setNewCompany({ tier: 'core', people: [] });
    setShowAddCompany(false);
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.name || !newPerson.email || !newPerson.role || !showAddPerson) return;

    try {
      const { data, error } = await supabase
        .from('people')
        .insert({
          company_id: showAddPerson,
          name: newPerson.name,
          email: newPerson.email,
          role: newPerson.role
        })
        .select()
        .single();

      if (error) throw error;

      setCompanies(prev => prev.map(company => 
        company.id === showAddPerson
          ? { ...company, people: [data, ...company.people] }
          : company
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add person');
    }

    setNewPerson({});
    setShowAddPerson(null);
  };

  const handleEditCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany?.id || !editingCompany.name) return;

    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: editingCompany.name,
          tier: editingCompany.tier
        })
        .eq('id', editingCompany.id);

      if (error) throw error;

      setCompanies(prev => prev.map(company => 
        company.id === editingCompany.id
          ? { ...company, name: editingCompany.name, tier: editingCompany.tier }
          : company
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company');
    }

    setEditingCompany(null);
  };

  const handleEditPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerson?.id) return;

    try {
      const { error } = await supabase
        .from('people')
        .update({
          name: editingPerson.name,
          email: editingPerson.email,
          role: editingPerson.role
        })
        .eq('id', editingPerson.id);

      if (error) throw error;

      setCompanies(prev => prev.map(company => ({
        ...company,
        people: company.people.map(person =>
          person.id === editingPerson.id
            ? { ...person, ...editingPerson }
            : person
        )
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update person');
    }

    setEditingPerson(null);
  };

  const handleDeleteCompany = async () => {
    if (!deletingCompany) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', deletingCompany.id);

      if (error) throw error;

      setCompanies(prev => prev.filter(company => company.id !== deletingCompany.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company');
    }

    setDeletingCompany(null);
  };

  const handleDeletePerson = async () => {
    if (!deletingPerson) return;

    try {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', deletingPerson.id);

      if (error) throw error;

      setCompanies(prev => prev.map(company => ({
        ...company,
        people: company.people.filter(person => person.id !== deletingPerson.id)
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete person');
    }

    setDeletingPerson(null);
  };

  const handleGenerateCertificate = (type: 'personal' | 'company', name: string, tier: 'core' | 'premium' | 'platinum') => {
    setCertificateData({ 
      type, 
      name, 
      tier,
      issueDate: new Date().toISOString().split('T')[0]
    });
    setShowCertificateModal(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Partner Companies & People</h1>
        <button
          onClick={() => setShowAddCompany(true)}
          className="flex items-center gap-2 px-6 py-3 bg-pf-primary text-white rounded-lg hover:bg-opacity-90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Partner</span>
        </button>
      </div>
      
      {error && (
        <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No partners found. Click the "New Partner" button to get started.</div>
        ) : (
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Partner Companies</h2>
            </div>
          </div>
        )}

        <CompanyList
          companies={companies}
          expandedCompanies={expandedCompanies}
          onToggleCompany={toggleCompany}
          onAddPerson={id => setShowAddPerson(id)}
          onGenerateCertificate={handleGenerateCertificate}
          onEditCompany={setEditingCompany}
          onDeleteCompany={setDeletingCompany}
          onEditPerson={setEditingPerson}
          onDeletePerson={setDeletingPerson}
        />
      </div>

      {showAddCompany && (
        <AddCompanyModal
          onClose={() => setShowAddCompany(false)}
          onSubmit={handleAddCompany}
          newCompany={newCompany}
          onCompanyChange={setNewCompany}
        />
      )}

      {showAddPerson && (
        <AddPersonModal
          onClose={() => setShowAddPerson(null)}
          onSubmit={handleAddPerson}
          newPerson={newPerson}
          onPersonChange={setNewPerson}
        />
      )}

      {editingCompany && (
        <EditCompanyModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSubmit={handleEditCompany}
          onChange={setEditingCompany}
        />
      )}

      {editingPerson && (
        <EditPersonModal
          person={editingPerson}
          onClose={() => setEditingPerson(null)}
          onSubmit={handleEditPerson}
          onChange={setEditingPerson}
        />
      )}

      {deletingCompany && (
        <DeleteConfirmationModal
          type="company"
          name={deletingCompany.name}
          onConfirm={handleDeleteCompany}
          onCancel={() => setDeletingCompany(null)}
        />
      )}

      {deletingPerson && (
        <DeleteConfirmationModal
          type="person"
          name={deletingPerson.name}
          onConfirm={handleDeletePerson}
          onCancel={() => setDeletingPerson(null)}
        />
      )}

      {showCertificateModal && certificateData && (
        <CertificateModal
          data={certificateData}
          onClose={() => {
            setShowCertificateModal(false);
            setCertificateData(null);
          }}
          onGenerate={async () => {
            const event = new CustomEvent('generateCertificate', {
              detail: certificateData
            });
            window.dispatchEvent(event);
            setShowCertificateModal(false);
            setCertificateData(null);
          }}
        />
      )}
    </div>
  );
}