import React from 'react';

// SVG assets embedded as React components for portability
const GrapeLogo = () => (
  <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M200 400C310.457 400 400 310.457 400 200C400 89.543 310.457 0 200 0C89.543 0 0 89.543 0 200C0 310.457 89.543 400 200 400Z" fill="currentColor"/>
  </svg>
);

const ProductFruitsLogo = () => (
  <svg width="100%" height="34" viewBox="0 0 156 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M29.2 11.9c-.3-.3-.6-.6-1-.8-.4-.2-.8-.3-1.2-.3h-4.8V6.2c0-.4-.1-.8-.3-1.2-.2-.4-.4-.7-.8-1-.3-.3-.6-.6-1-.8-.4-.2-.8-.3-1.2-.3h-4.8V1.5c0-.4-.3-.7-.7-.7s-.7.3-.7.7v1.5h-4.8c-.4 0-.8.1-1.2.3-.4.2-.7.4-1 .8-.3.3-.6.6-.8 1-.2.4-.3.8-.3 1.2v4.8H1.5c-.4 0-.7.3-.7.7s.3.7.7.7h4.8v4.8c0 .4.1.8.3 1.2.2.4.4.7.8 1 .3.3.6.6 1 .8.4.2.8.3 1.2.3h4.8v4.8c0 .4.1.8.3 1.2.2.4.4.7.8 1 .3.3.6.6 1 .8.4.2.8.3 1.2.3h4.8v4.8c0 .4.3.7.7.7s.7-.3.7-.7v-4.8h4.8c.4 0 .8-.1 1.2-.3.4-.2.7-.4 1-.8.3-.3.6-.6.8-1 .2-.4.3-.8.3-1.2v-4.8h4.8c.4 0 .7-.3.7-.7s-.3-.7-.7-.7h-4.8v-4.8c0-.4-.1-.8-.3-1.2-.2-.4-.5-.7-.8-1zm-2.2 11.6c0 .8-.3 1.5-.9 2.1-.6.6-1.3.9-2.1.9h-4.8v-4.8c0-.4-.3-.7-.7-.7s-.7.3-.7.7v4.8h-4.8c-.8 0-1.5-.3-2.1-.9-.6-.6-.9-1.3-.9-2.1v-4.8h4.8c.4 0 .7-.3.7-.7s-.3-.7-.7-.7h-4.8v-4.8c0-.8.3-1.5.9-2.1.6-.6 1.3-.9 2.1-.9h4.8v4.8c0 .4.3.7.7.7s.7-.3.7-.7V6.2c0-.8.3-1.5.9-2.1.6-.6 1.3-.9 2.1-.9h4.8v4.8c0 .8-.3 1.5-.9 2.1-.6.6-1.3.9-2.1.9h-4.8c-.4 0-.7.3-.7.7s.3.7.7.7h4.8c.8 0 1.5.3 2.1.9.6.6.9 1.3.9 2.1v4.8h-4.8c-.4 0-.7.3-.7.7s.3.7.7.7h4.8v4.8z" fill="#2F2F2F"/>
  </svg>
);

interface PartnerBadgeProps {
  type: 'core' | 'premium' | 'platinum';
  variant?: 'modern' | 'shield';
  title?: string;
  className?: string;
}

// Add these CSS variables to your stylesheet
const styles = `
:root {
  --pf-primary: #FF741D;
  --pf-gradient-from: #FF8B27;
  --pf-gradient-to: #FF4708;
  --pf-dark-text: #2F2F2F;
  --pf-blue: #0071D9;
}

.pf-badge {
  position: relative;
  background: white;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.2s;
  width: 240px;
  text-decoration: none;
}

.pf-badge:hover {
  transform: scale(1.05);
  text-decoration: none;
}

.pf-badge-header {
  position: relative;
  background: white;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  border: 4px solid;
  border-bottom-width: 0;
  padding: 1.5rem;
  padding-bottom: 0.75rem;
}

.pf-badge-watermark {
  position: absolute;
  top: -40%;
  bottom: 0;
  right: -40%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  opacity: 0.05;
}

.pf-badge-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pf-badge-title {
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--pf-dark-text);
}

.pf-badge-footer {
  padding: 0.75rem 1.5rem;
  text-align: center;
  border: 4px solid;
  border-top-width: 0;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.pf-badge-type {
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
}
`;

export function PartnerBadge({ type, title, className = '' }: PartnerBadgeProps) {
  const badges = {
    core: {
      color: '#0071D9',
      label: 'CERTIFIED PARTNER'
    },
    premium: {
      color: '#FF741D',
      label: 'CERTIFIED PARTNER'
    },
    platinum: {
      color: 'linear-gradient(to right, #FF8B27, #FF4708)',
      label: 'CERTIFIED PARTNER'
    }
  };

  const { color, label } = badges[type];

  return (
    <a
      href="https://productfruits.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`pf-badge ${className}`}
    >
      <div className="pf-badge-header" style={{ borderColor: color }}>
        <div className="pf-badge-watermark">
          <GrapeLogo />
        </div>
        <div className="pf-badge-content">
          <ProductFruitsLogo />
          <span className="pf-badge-title">
            {title || label}
          </span>
        </div>
      </div>
      <div className="pf-badge-footer" style={{ 
        borderColor: color,
        background: color
      }}>
        <span className="pf-badge-type">{type.toUpperCase()}</span>
      </div>
    </a>
  );
}

// Usage example:
// <PartnerBadge type="premium" />