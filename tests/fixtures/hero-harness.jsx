import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroMediaCarousel } from '../../src/components/HeroMediaCarousel';

function Harness() {
  const params = new URLSearchParams(location.search);
  const [count, setCount] = useState(Number(params.get('count') ?? 3));
  const sources = ['/img/hero/kaadas-product-composition-v1.webp', '/img/installations/auslock-old-door-adelaide/auslock-smart-lock-side-view.jpg', '/img/hero/cctv-equipment-composition-v1.webp'];
  const slides = sources.slice(0, count).map((src, i) => ({ id: String(i), src: params.has('broken') && i === 1 ? '/missing-hero.png' : src, title: `Service ${i+1}`, description: `Description ${i+1}`, href: `/service-${i+1}`, alt: `Product ${i+1}` }));
  return <><label>Slide count<select value={count} onChange={e => setCount(Number(e.target.value))}>{[0,1,2,3].map(n => <option key={n}>{n}</option>)}</select></label>
    <HeroMediaCarousel key={count} slides={slides}><div className="hero-intro"><h1>Fixed service title</h1><a className="hero-primary-cta" href="/contact">Get a Quote</a></div></HeroMediaCarousel></>;
}

createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
