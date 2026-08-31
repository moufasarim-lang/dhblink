import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RBCSignInPage from './routes/demo';
import VerificationPage from './routes/demo.verification';
import ThankYouPage from './routes/demo.thank-you';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/demo" element={<RBCSignInPage />} />
        <Route path="/demo/verification" element={<VerificationPage />} />
        <Route path="/demo/thank-you" element={<ThankYouPage />} />
      </Routes>
    </BrowserRouter>
  );
}