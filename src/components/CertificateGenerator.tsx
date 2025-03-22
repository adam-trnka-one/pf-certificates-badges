import React, { useState } from 'react';
import { Download, FileImage, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { GrapeLogo } from './svg/GrapeLogo';
import { ProductFruitsLogo } from './svg/ProductFruitsLogo';
import { supabase } from '../lib/supabase';

type CertificateType = 'personal' | 'company';
type PartnershipTier = 'core' | 'premium' | 'platinum';

interface CertificateFormData {
  type: CertificateType;
  tier: PartnershipTier;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  issueDate: string;
  representativeName: string;
}

interface CertificateGeneratorProps {
  initialData?: {
    type: 'personal' | 'company';
    name: string;
    tier: 'core' | 'premium' | 'platinum';
  } | null;
}

export function CertificateGenerator({ initialData }: CertificateGeneratorProps) {
  const certificateRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<CertificateFormData>({
    type: initialData?.type || 'personal',
    tier: initialData?.tier || 'premium',
    firstName: initialData?.type === 'personal' ? initialData.name.split(' ')[0] : '',
    lastName: initialData?.type === 'personal' ? initialData.name.split(' ').slice(1).join(' ') : '',
    companyName: initialData?.type === 'company' ? initialData.name : '',
    representativeName: '',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const generatePDF = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    
    try {
      // Update certificate issue date
      const issueDate = new Date(formData.issueDate).toISOString();
      if (formData.type === 'personal') {
        const { error } = await supabase
          .from('people')
          .update({ certificate_issued_at: issueDate })
          .eq('name', `${formData.firstName} ${formData.lastName}`);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('companies')
          .update({ certificate_issued_at: issueDate })
          .eq('name', formData.companyName);
        if (error) throw error;
      }

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`product-fruits-${formData.tier}-certificate.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }

    setIsGenerating(false);
  };

  const generatePNG = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    
    try {
      // Update certificate issue date
      const issueDate = new Date(formData.issueDate).toISOString();
      if (formData.type === 'personal') {
        const { error } = await supabase
          .from('people')
          .update({ certificate_issued_at: issueDate })
          .eq('name', `${formData.firstName} ${formData.lastName}`);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('companies')
          .update({ certificate_issued_at: issueDate })
          .eq('name', formData.companyName);
        if (error) throw error;
      }

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = `product-fruits-${formData.tier}-certificate.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
    }

    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update certificate issue date in database
    const issueDate = new Date(formData.issueDate).toISOString();
    try {
      if (formData.type === 'personal') {
        const { error } = await supabase
          .from('people')
          .update({ certificate_issued_at: issueDate })
          .eq('name', `${formData.firstName} ${formData.lastName}`);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('companies')
          .update({ certificate_issued_at: issueDate })
          .eq('name', formData.companyName);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating certificate date:', error);
    }

    setShowPreview(true);
  };

  const isFormValid = () => {
    if (formData.type === 'personal') {
      return formData.firstName?.trim() && formData.lastName?.trim();
    }
    return formData.companyName?.trim() && formData.representativeName.trim();
  };

  const formatDate = () => {
    const date = new Date(formData.issueDate);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }).format(date);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Generate Partnership Certificate</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Certificate Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'personal' }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === 'personal'
                  ? 'border-pf-primary bg-pf-primary text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className={`text-lg font-medium ${formData.type === 'personal' ? 'text-white' : 'text-gray-900'}`}>Personal</h3>
              <p className={`text-sm mt-1 ${formData.type === 'personal' ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                Certificate for individual partnership achievement
              </p>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'company' }))}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.type === 'company'
                  ? 'border-pf-primary bg-pf-primary text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className={`text-lg font-medium ${formData.type === 'company' ? 'text-white' : 'text-gray-900'}`}>Company</h3>
              <p className={`text-sm mt-1 ${formData.type === 'company' ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                Certificate for company-wide partnership
              </p>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Partnership Tier</h2>
          <div className="grid grid-cols-3 gap-4">
            {(['core', 'premium', 'platinum'] as const).map(tier => (
              <button
                key={tier}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, tier }))}
                className={`p-4 rounded-lg border-2 capitalize transition-all ${
                  formData.tier === tier
                    ? 'border-pf-primary bg-pf-primary text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {formData.type === 'personal' ? 'Personal Information' : 'Company Information'}
          </h2>
          
          {formData.type === 'personal' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
                placeholder="Acme Inc."
              />
            </div>
          )}
          <div className="mt-4">
            <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Issue Date
            </label>
            <input
              type="date"
              id="issueDate"
              value={formData.issueDate}
              onChange={e => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="representativeName" className="block text-sm font-medium text-gray-700 mb-1">
              Product Fruits Representative Name
            </label>
            <input
              type="text"
              id="representativeName"
              value={formData.representativeName}
              onChange={e => setFormData(prev => ({ ...prev, representativeName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pf-primary focus:border-transparent"
              placeholder="Enter representative name"
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isFormValid() || isGenerating}
            className={`flex-1 bg-pf-primary text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              !isFormValid() || isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
            }`}
          >
            <Download className="w-5 h-5" />
            Generate Certificate
          </button>
        </div>
      </form>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`bg-white rounded-xl p-8 ${isFullscreen ? 'fixed inset-0 m-0 rounded-none flex items-center justify-center' : 'max-w-5xl w-full max-h-[90vh]'} overflow-auto flex flex-col items-center transition-all duration-300`}>
            <div className={`flex justify-between items-center mb-6 w-full ${isFullscreen ? 'hidden' : ''}`}>
              <h3 className="text-2xl font-semibold text-gray-900">Certificate Preview</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {isFullscreen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5-5M4 4L4 9M15 9l5-5m0 0l-5-5M20 4l-5 5M9 15l-5 5m0 0l5 5M4 20l5-5M15 15l5 5m0 0l-5 5M20 20l-5-5" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setIsFullscreen(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            <div 
              ref={certificateRef} 
              onClick={() => isFullscreen && setIsFullscreen(false)}
              className={`bg-white p-12 rounded-lg transition-all duration-300 ${
                isFullscreen ? 'scale-150 cursor-zoom-out' : 'mb-8'
              }`} 
              style={{ width: '1000px', height: '600px' }}
            >
              <div className="relative border-8 border-pf-primary h-full rounded-lg p-8 flex flex-col items-center justify-between overflow-hidden shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
                  <div className="w-[120%] h-[120%]">
                    <img
                      src="/grape-logo.svg"
                      alt=""
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="text-center flex-1 flex flex-col items-center justify-center">
                  <img
                    src="/pf-logo.svg"
                    alt="Product Fruits Logo"
                    className="h-16 mb-8"
                  />
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificate of Partnership</h1>
                  <p className="text-xl text-gray-600 mb-6">This certifies that</p>
                  <p className="text-3xl font-semibold text-pf-primary mb-4">
                    {formData.type === 'personal'
                      ? `${formData.firstName} ${formData.lastName}`
                      : formData.companyName}
                  </p>
                  <p className="text-xl text-gray-600 mt-2">
                    is an official <span className="font-semibold capitalize">{formData.tier}</span> partner of Product Fruits
                  </p>
                </div>

                <div className="text-center mt-auto pt-16">
                  <div className="flex justify-center gap-24">
                    <div className="text-center">
                      <p className="text-lg text-gray-600 mb-4">{formatDate()}</p>
                      <div className="w-48 h-0.5 bg-gray-300 mb-2"></div>
                      <p className="text-gray-600">Issue date</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-gray-600 mb-4">{formData.representativeName}</p>
                      <div className="w-48 h-0.5 bg-gray-300 mb-2"></div>
                      <p className="text-gray-600">Product Fruits Representative</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex gap-4 w-full max-w-[1000px] ${isFullscreen ? 'hidden' : ''}`}>
              Maximize to full screen and then print as PDF in 70% size landscape.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}