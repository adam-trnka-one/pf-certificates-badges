import React, { useState, useEffect } from 'react';
import { Building2, Users, ChevronDown, ChevronRight, UserPlus, Building, Plus, X, Award, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Person {
  id: string;
  company_id: string;
  name: string;
  role: string;
  email: string;
  certificate_issued_at: string | null;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
  tier: 'core' | 'premium' | 'platinum';
  created_at: string;
  certificate_issued_at: string | null;
  people: Person[];
}

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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-pf-gradient text-white';
      case 'premium': return 'bg-pf-primary text-white';
      case 'core': return 'bg-pf-blue text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
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

        <div className="divide-y divide-gray-200">
          {companies.map(company => (
            <div key={company.id} className="group">
              <div
                className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleCompany(company.id)}
              >
                <div className="flex items-center gap-4">
                  {expandedCompanies.has(company.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <Building className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">{company.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(company.tier)}`}>
                    {company.tier}
                  </span>
                  {company.certificate_issued_at && (
                    <span className="text-sm text-gray-500">
                      Certificate issued: {new Date(company.certificate_issued_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{company.people.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddPerson(company.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                      title="Add Person"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateCertificate('company', company.name, company.tier);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                      title="Generate Certificate"
                    >
                      <Award className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCompany(company);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                      title="Edit Company"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingCompany(company);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-all"
                      title="Delete Company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {expandedCompanies.has(company.id) && (
                <div className="bg-gray-50 border-t border-gray-200">
                  {company.people.map(person => (
                    <div
                      key={person.id}
                      className="p-4 pl-14 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 flex items-center gap-4">
                        <div className="flex-1 flex items-center gap-4">
                          <span className="font-medium text-gray-900">{person.name}</span>
                          <span className="text-sm text-gray-500">{person.role}</span>
                          <span className="text-sm text-gray-500">{person.email}</span>
                          {person.certificate_issued_at && (
                            <span className="text-sm text-gray-500">
                              Certificate issued: {new Date(person.certificate_issued_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleGenerateCertificate('personal', person.name, company.tier)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                            title="Generate Certificate"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingPerson(person)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                            title="Edit Person"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingPerson(person)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-all"
                            title="Delete Person"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Company Modal */}
      {showAddCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Company</h3>
              <button
                onClick={() => setShowAddCompany(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={newCompany.name || ''}
                  onChange={e => setNewCompany(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="companyTier" className="block text-sm font-medium text-gray-700 mb-1">
                  Partnership Tier
                </label>
                <select
                  id="companyTier"
                  value={newCompany.tier}
                  onChange={e => setNewCompany(prev => ({ ...prev, tier: e.target.value as 'core' | 'premium' | 'platinum' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                >
                  <option value="core">Core</option>
                  <option value="premium">Premium</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-pf-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Add Company
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Person Modal */}
      {showAddPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add New Person</h3>
              <button
                onClick={() => setShowAddPerson(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPerson} className="space-y-4">
              <div>
                <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="personName"
                  value={newPerson.name || ''}
                  onChange={e => setNewPerson(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="personEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="personEmail"
                  value={newPerson.email || ''}
                  onChange={e => setNewPerson(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="personRole" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="personRole"
                  value={newPerson.role || ''}
                  onChange={e => setNewPerson(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pf-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Add Person
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Company</h3>
              <button
                onClick={() => setEditingCompany(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditCompany} className="space-y-4">
              <div>
                <label htmlFor="editCompanyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="editCompanyName"
                  value={editingCompany.name}
                  onChange={e => setEditingCompany(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="editCompanyTier" className="block text-sm font-medium text-gray-700 mb-1">
                  Partnership Tier
                </label>
                <select
                  id="editCompanyTier"
                  value={editingCompany.tier}
                  onChange={e => setEditingCompany(prev => ({ ...prev!, tier: e.target.value as 'core' | 'premium' | 'platinum' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                >
                  <option value="core">Core</option>
                  <option value="premium">Premium</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-pf-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Update Company
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Person Modal */}
      {editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Person</h3>
              <button
                onClick={() => setEditingPerson(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditPerson} className="space-y-4">
              <div>
                <label htmlFor="editPersonName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="editPersonName"
                  value={editingPerson.name}
                  onChange={e => setEditingPerson(prev => ({ ...prev!, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="editPersonEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="editPersonEmail"
                  value={editingPerson.email}
                  onChange={e => setEditingPerson(prev => ({ ...prev!, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="editPersonRole" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="editPersonRole"
                  value={editingPerson.role}
                  onChange={e => setEditingPerson(prev => ({ ...prev!, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pf-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Update Person
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Company Confirmation Modal */}
      {deletingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Delete Company</h3>
              <button
                onClick={() => setDeletingCompany(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deletingCompany.name}</span>?
                This action cannot be undone and will also delete all associated people.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeletingCompany(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCompany}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Person Confirmation Modal */}
      {deletingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Delete Person</h3>
              <button
                onClick={() => setDeletingPerson(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deletingPerson.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeletingPerson(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePerson}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Person
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificateModal && certificateData && (
        <div className="fixed inset-0 bg-black bg-opacity