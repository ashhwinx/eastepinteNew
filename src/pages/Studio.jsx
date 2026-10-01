import React from 'react';
import { Studio } from 'sanity';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import config from '../../sanity.config';

export default function StudioPage() {
  return (
    <div
      data-ui-color-scheme="dark"
      className="dark"
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0c0d0e',
      }}
    >
      {/* Embedded Sanity Studio */}
      <div style={{ height: '100%', width: '100%' }}>
        <Studio config={config} />
      </div>

      {/* Floating Return to Website Button */}
      <Link
        to="/"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          backgroundColor: '#16181b',
          color: '#f3f4f6',
          border: '1px solid rgba(212, 163, 115, 0.4)',
          borderRadius: '9999px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#d4a373';
          e.currentTarget.style.color = '#121316';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#16181b';
          e.currentTarget.style.color = '#f3f4f6';
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Website</span>
      </Link>
    </div>
  );
}
