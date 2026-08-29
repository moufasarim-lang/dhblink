import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.location.replace('/interac.html');
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <p>Redirection vers Interac e-Transfer...</p>
    </div>
  );
}
