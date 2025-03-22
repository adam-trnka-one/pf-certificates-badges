import React from 'react';
import { Building2, Users, ChevronDown, ChevronRight, UserPlus, Building, Award, Pencil, Trash2 } from 'lucide-react';
import { Company } from '../../types/partners';

interface CompanyListProps {
  companies: Company[];
  expandedCompanies: Set<string>;
  onToggleCompany: (id: string) => void;
  onAddPerson: (companyId: string) => void;
  onGenerateCertificate: (type: 'personal' | 'company', name: string, tier: 'core' | 'premium' | 'platinum') => void;
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (company: Company) => void;
  onEditPerson: (person: any) => void;
  onDeletePerson: (person: any) => void;
}

export function CompanyList({
  companies,
  expandedCompanies,
  onToggleCompany,
  onAddPerson,
  onGenerateCertificate,
  onEditCompany,
  onDeleteCompany,
  onEditPerson,
  onDeletePerson
}: CompanyListProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-pf-gradient text-white';
      case 'premium': return 'bg-pf-primary text-white';
      case 'core': return 'bg-pf-blue text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {companies.map(company => (
        <div key={company.id} className="group">
          <div
            className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
            onClick={() => onToggleCompany(company.id)}
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
                    onAddPerson(company.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                  title="Add Person"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateCertificate('company', company.name, company.tier);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                  title="Generate Certificate"
                >
                  <Award className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCompany(company);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                  title="Edit Company"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCompany(company);
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
                        onClick={() => onGenerateCertificate('personal', person.name, company.tier)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        title="Generate Certificate"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditPerson(person)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        title="Edit Person"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePerson(person)}
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
  );
}