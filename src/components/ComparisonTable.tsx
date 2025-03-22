import React from 'react';

export function ComparisonTable() {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="py-4 px-6 text-left text-sm font-semibold text-gray-900">Features</th>
              <th scope="col" className="py-4 px-6 text-center text-sm font-semibold text-pf-blue">Core</th>
              <th scope="col" className="py-4 px-6 text-center text-sm font-semibold text-pf-primary">Premium</th>
              <th scope="col" className="py-4 px-6 text-center text-sm font-semibold bg-pf-gradient text-transparent bg-clip-text">Platinum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-4 px-6 text-sm font-medium text-gray-900">Products</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Product without AI Studio</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Product without AI Studio</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Product including AI Studio</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-4 px-6 text-sm font-medium text-gray-900">Education sessions</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Video (6 hours)</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Live (7 hours)</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Live (10 hours)</td>
            </tr>
            <tr>
              <td className="py-4 px-6 text-sm font-medium text-gray-900">Support</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Standard</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Priority</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">Slack #channel</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-4 px-6 text-sm font-medium text-gray-900">Product meeting</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">2 hours / 6 months</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">2 hours / 3 months</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">1 hour / month</td>
            </tr>
            <tr>
              <td className="py-4 px-6 text-sm font-medium text-gray-900">ARR KPI in total (12 months)</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">$800</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">$1500</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">$2000</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="py-4 px-6 text-sm font-medium text-gray-900">Certificate validity</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">12 months</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">12 months</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">12 months</td>
            </tr>
            <tr>
              <td className="py-4 px-6 text-sm font-medium text-gray-900">Certification fee</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">-</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">$500</td>
              <td className="py-4 px-6 text-sm text-gray-700 text-center">$1000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}