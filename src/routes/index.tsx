import { createFileRoute } from '@tanstack/react-router'
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
  )
}
