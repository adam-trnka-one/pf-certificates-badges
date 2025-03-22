import React from 'react';
import { useState } from 'react';
import { PartnerBadge } from './components/PartnerBadges';
import { CertificateGenerator } from './components/CertificateGenerator';
import { ComparisonTable } from './components/ComparisonTable';
import { Partners } from './components/partners';
import { useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'badges' | 'certificates' | 'partners'>('tiers');
  const [certificateData, setCertificateData] = useState<{
    type: 'personal' | 'company';
    name: string;
    tier: 'core' | 'premium' | 'platinum';
  } | null>(null);

  useEffect(() => {
    const handleGenerateCertificate = (event: CustomEvent) => {
      setActiveTab('certificates');
      setCertificateData(event.detail);
    };

    window.addEventListener('generateCertificate', handleGenerateCertificate as EventListener);

    return () => {
      window.removeEventListener('generateCertificate', handleGenerateCertificate as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4">
      <div className="max-w-5xl mx-auto py-12">
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === 'tiers'
                ? 'bg-pf-primary text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tiers
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === 'partners'
                ? 'bg-pf-primary text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Partners
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === 'certificates'
                ? 'bg-pf-primary text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Certificates
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all ${
              activeTab === 'badges'
                ? 'bg-pf-primary text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Badges
          </button>
        </div>

        {activeTab === 'tiers' ? (
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-8">Product Fruits Partnership Tiers</h1>
            <ComparisonTable />
          </div>
        ) : activeTab === 'partners' ? (
          <Partners />
        ) : activeTab === 'badges' ? (
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-3xl font-semibold text-gray-900">Product Fruits Partner Badges</h1>
            <div className="flex gap-12">
              <PartnerBadge type="core" variant="modern" />
              <PartnerBadge type="premium" variant="modern" />
              <PartnerBadge type="platinum" variant="modern" />
            </div>
            <div className="mt-8 text-sm text-gray-600">
              <p>Hover over the badges to see interactive states.</p>
              <p className="mt-2 text-center">
                Modern style badges for Core, Premium, and Platinum tiers. Click the buttons below each badge to copy its code.
              </p>
            </div>
          </div>
        ) : activeTab === 'certificates' ? (
          <CertificateGenerator initialData={certificateData} />
        ) : (
          <Partners />
        )}
      </div>
    </div>
  );
}

export default App;
