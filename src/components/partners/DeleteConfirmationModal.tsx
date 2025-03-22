import React from 'react';
import { X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  type: 'company' | 'person';
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({ type, name, onConfirm, onCancel }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Delete {type === 'company' ? 'Company' : 'Person'}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{name}</span>?
            {type === 'company' && ' This action cannot be undone and will also delete all associated people.'}
            {type === 'person' && ' This action cannot be undone.'}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete {type === 'company' ? 'Company' : 'Person'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}