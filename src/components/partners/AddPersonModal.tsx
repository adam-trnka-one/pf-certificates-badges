import React from 'react';
import { X } from 'lucide-react';
import { Person } from '../../types/partners';

interface AddPersonModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newPerson: Partial<Person>;
  onPersonChange: (person: Partial<Person>) => void;
}

export function AddPersonModal({ onClose, onSubmit, newPerson, onPersonChange }: AddPersonModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add New Person</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="personName"
              value={newPerson.name || ''}
              onChange={e => onPersonChange({ ...newPerson, name: e.target.value })}
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
              onChange={e => onPersonChange({ ...newPerson, email: e.target.value })}
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
              onChange={e => onPersonChange({ ...newPerson, role: e.target.value })}
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
  );
}