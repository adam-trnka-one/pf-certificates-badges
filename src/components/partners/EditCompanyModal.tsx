import React from 'react';
import { X } from 'lucide-react';
import { Company } from '../../types/partners';

interface EditCompanyModalProps {
  company: Company;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (company: Company) => void;
}

export function EditCompanyModal({ company, onClose, onSubmit, onChange }: EditCompanyModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Edit Company</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="editCompanyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="editCompanyName"
              value={company.name}
              onChange={e => onChange({ ...company, name: e.target.value })}
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
              value={company.tier}
              onChange={e => onChange({ ...company, tier: e.target.value as 'core' | 'premium' | 'platinum' })}
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
  );
}