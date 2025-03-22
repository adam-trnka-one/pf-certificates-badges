import React from 'react';
import { X } from 'lucide-react';

interface CertificateModalProps {
  data: {
    type: 'personal' | 'company';
    name: string;
    tier: 'core' | 'premium' | 'platinum';
  };
  onClose: () => void;
  onGenerate: () => void;
}

export function CertificateModal({ data, onClose, onGenerate }: CertificateModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Generate Certificate</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            Generate a {data.tier} tier certificate for{' '}
            <span className="font-semibold text-gray-900">{data.name}</span>
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onGenerate}
              className="px-4 py-2 bg-pf-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Generate Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}