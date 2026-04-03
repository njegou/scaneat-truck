const { useState, useMemo, useEffect } = React;

// --- SPLASH SCREEN ---
const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  // phase 0: truck slides in from left
  // phase 1: QR scan laser sweeps
  // phase 2: logo name + slogan appear
  // phase 3: fade out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 1600),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => onComplete(), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#fff',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 3 ? 0 : 1,
      transition: phase === 3 ? 'opacity 0.5s ease' : 'none',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes truckSlideIn {
          from { transform: translateX(-120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes laserSweep {
          0%   { top: 18%; opacity: 1; }
          100% { top: 78%; opacity: 0.6; }
        }
        @keyframes scanFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes fadeSlideUp {
          from { transform: translateY(18px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.4); }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* Truck SVG animé */}
      <div style={{
        animation: 'truckSlideIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards',
        position: 'relative',
        width: 200, height: 130,
      }}>
        {/* QR scan overlay */}
        {phase >= 1 && phase < 3 && (
          <div style={{
            position: 'absolute', left: 8, right: 8,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #f97316, #f97316, transparent)',
            borderRadius: 2,
            animation: 'laserSweep 0.85s ease-in-out forwards',
            zIndex: 10,
            boxShadow: '0 0 8px 2px rgba(249,115,22,0.5)',
          }} />
        )}

        <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
          width: '100%', height: '100%',
          animation: phase >= 1 ? 'scanFlicker 0.15s ease 3' : 'none',
        }}>
          {/* Body */}
          <rect x="30" y="30" width="140" height="70" rx="8" fill="#f97316"/>
          {/* Cab */}
          <rect x="140" y="45" width="35" height="55" rx="6" fill="#f97316"/>
          {/* Windshield */}
          <rect x="148" y="50" width="22" height="28" rx="3" fill="rgba(255,255,255,0.35)"/>
          {/* Window strip on body */}
          <rect x="38" y="38" width="95" height="18" rx="3" fill="rgba(255,255,255,0.2)"/>
          {/* QR code area on body */}
          <rect x="38" y="60" width="40" height="32" rx="3" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5"/>
          {/* QR dots simplified */}
          <rect x="42" y="64" width="7" height="7" rx="1" fill="white" opacity="0.8"/>
          <rect x="67" y="64" width="7" height="7" rx="1" fill="white" opacity="0.8"/>
          <rect x="42" y="81" width="7" height="7" rx="1" fill="white" opacity="0.8"/>
          <rect x="53" y="72" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
          <rect x="60" y="68" width="3" height="3" rx="0.5" fill="white" opacity="0.6"/>
          <rect x="65" y="76" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
          <rect x="55" y="80" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
          {/* ScanEat text on truck */}
          <text x="88" y="82" fontFamily="Georgia, serif" fontWeight="900" fontSize="11" fill="white" fontStyle="italic">ScanEat</text>
          {/* Ground line */}
          <line x1="20" y1="110" x2="185" y2="110" stroke="#f97316" strokeWidth="2" strokeOpacity="0.3"/>
          {/* Wheels */}
          <g style={{transformOrigin:'55px 110px', animation: phase >= 0 ? 'wheelSpin 0.7s linear' : 'none'}}>
            <circle cx="55" cy="110" r="14" fill="#1f2937"/>
            <circle cx="55" cy="110" r="8" fill="#374151"/>
            <circle cx="55" cy="110" r="3" fill="#f97316"/>
          </g>
          <g style={{transformOrigin:'150px 110px', animation: phase >= 0 ? 'wheelSpin 0.7s linear' : 'none'}}>
            <circle cx="150" cy="110" r="14" fill="#1f2937"/>
            <circle cx="150" cy="110" r="8" fill="#374151"/>
            <circle cx="150" cy="110" r="3" fill="#f97316"/>
          </g>
          {/* Exhaust puff */}
          {phase >= 0 && <>
            <circle cx="25" cy="85" r="5" fill="#f3f4f6" opacity="0.7"/>
            <circle cx="18" cy="80" r="4" fill="#f3f4f6" opacity="0.5"/>
            <circle cx="12" cy="74" r="3" fill="#f3f4f6" opacity="0.3"/>
          </>}
        </svg>
      </div>

      {/* Brand name */}
      <div style={{
        marginTop: 20,
        opacity: phase >= 2 ? 1 : 0,
        animation: phase >= 2 ? 'fadeSlideUp 0.5s ease forwards' : 'none',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: 42,
          color: '#1f2937',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}>
          ScanEat<span style={{color:'#f97316'}}>.</span>
        </div>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: '#9ca3af',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginTop: 6,
          opacity: phase >= 2 ? 1 : 0,
          animation: phase >= 2 ? 'fadeSlideUp 0.5s ease 0.15s both' : 'none',
        }}>
          Scannez. Commandez. Savourez.
        </div>
      </div>

      {/* Loading dots */}
      {phase >= 2 && (
        <div style={{ display:'flex', gap:6, marginTop:28 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width:6, height:6, borderRadius:'50%', background:'#f97316',
              animation: `dotPulse 0.8s ease ${i*0.15}s infinite`,
              opacity: phase === 3 ? 0 : 1,
            }}/>
          ))}
        </div>
      )}
    </div>
  );
};

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState('selection-formule'); 
  const [selectedFormule, setSelectedFormule] = useState(null);
  const [selections, setSelections] = useState({ plat: null, boisson: null, dessert: null });
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  // --- VOTRE CARTE COMPLÈTE (image_42952e.png) ---
  const menu = {
    plats: [
      // Salades
      { id: 10, name: 'Salade César', image: '🥗', cat: 'Salades' },
      { id: 11, name: 'Salade Chèvre Chaud', image: '🐐', cat: 'Salades' },
      { id: 12, name: 'Salade Méditerranéenne', image: '🍅', cat: 'Salades' },
      { id: 13, name: 'Salade Composée', image: '🥬', cat: 'Salades' },
      // Pâtes
      { id: 1, name: 'Pâtes Carbonara', image: '🍝', cat: 'Pâtes' },
      { id: 2, name: 'Pâtes Bolognaise', image: '🍅', cat: 'Pâtes' },
      { id: 3, name: 'Pâtes Pesto', image: '🌿', cat: 'Pâtes' },
      { id: 4, name: 'Pâtes Arrabbiata', image: '🌶️', cat: 'Pâtes' },
      // Pokebowls
      { id: 5, name: 'Poke Saumon', image: '🐟', cat: 'Pokebowls' },
      { id: 6, name: 'Poke Thon', image: '🍣', cat: 'Pokebowls' },
      { id: 7, name: 'Poke Poulet Teriyaki', image: '🍗', cat: 'Pokebowls' },
      { id: 8, name: 'Poke Végétarien', image: '🥑', cat: 'Pokebowls' }
    ],
    boissons: [
      { id: 40, name: 'Eau Minérale', image: '💧' },
      { id: 41, name: 'Coca-Cola', image: '🥤' },
      { id: 42, name: 'Thé Glacé Maison', image: '🍹' },
      { id: 43, name: 'Limonade Artisanale', image: '🍋' }
    ],
    desserts: [
      { id: 30, name: 'Tiramisu Maison', image: '🍰' },
      { id: 31, name: 'Panna Cotta Coco', image: '🍮' }
    ]
  };

  const prixFormules = { solo: 9.50, duo: 11.50, trio: 14.90 };
  const bookingsPerSlot = { "12:15": 8, "12:30": 7, "13:00": 3 };

  // --- NAVIGATION ---
  const selectItem = (category, item) => {
    setSelections(prev => ({ ...prev, [category]: item }));
    if (category === 'plat') setStep('choix-boisson');
    else if (category === 'boisson') {
        if (selectedFormule === 'trio') setStep('choix-dessert');
        else setStep('recap');
    }
    else if (category === 'dessert') setStep('recap');
  };

  // --- FOND INGRÉDIENTS FLOTTANTS ---
  const foodItems = ['🥗','🍝','🍅','🌿','🌶️','🐟','🍣','🍗','🥑','🥬','🧄','🫒','🧀','🥚','🍋','🌾','🥕','🫑','🧅','🐐','🍹','💧'];
  const bgParticles = useMemo(() => Array.from({length: 35}, (_, i) => ({
    id: i,
    emoji: foodItems[i % foodItems.length],
    left: `${(i * 29 + 5) % 98}%`,
    top: `${(i * 41 + 3) % 105}%`,
    size: 24 + (i % 5) * 8,
    duration: 5 + (i % 6) * 2,
    delay: -(i * 0.9),
    rotate: (i * 17) % 50 - 25,
  })), []);

  const FoodBackground = ({ children, overlay = 'rgba(255,250,245,0.82)' }) => (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fef3e8', overflow: 'hidden' }}>
      <style>{`
        @keyframes floatBob {
          0%   { transform: translateY(0px) rotate(var(--rot)); opacity: 0.55; }
          50%  { transform: translateY(-16px) rotate(calc(var(--rot) + 6deg)); opacity: 0.75; }
          100% { transform: translateY(0px) rotate(var(--rot)); opacity: 0.55; }
        }
      `}</style>
      {/* Pattern ingrédients */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}>
        {bgParticles.map(p => (
          <span key={p.id} style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            fontSize: p.size + 12,
            '--rot': `${p.rotate}deg`,
            animation: `floatBob ${p.duration}s ease-in-out ${p.delay}s infinite`,
            userSelect: 'none',
          }}>{p.emoji}</span>
        ))}
      </div>
      {/* Voile léger par-dessus */}
      <div style={{ position:'absolute', inset:0, background: overlay, zIndex:1, pointerEvents:'none' }} />
      {/* Contenu */}
      <div style={{ position:'relative', zIndex:2 }}>
        {children}
      </div>
    </div>
  );

  // --- VUES ---
  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  if (step === 'selection-formule') return (
    <FoodBackground>
      <div className="min-h-screen p-8 flex flex-col justify-center">
        <h1 className="text-4xl font-black mb-2 italic uppercase text-center text-gray-800">ScanEat<span className="text-orange-500">.</span></h1>
        <p className="text-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">Borne de commande digitale</p>
        <div className="grid gap-4">
          <button onClick={() => {setSelectedFormule('solo'); setStep('choix-plat');}} className="p-8 border-2 border-gray-100 rounded-[40px] text-left hover:border-orange-500 transition-all bg-white/80 backdrop-blur-sm">
            <span className="text-[10px] font-black text-orange-500 uppercase">Solo</span>
            <h3 className="text-xl font-black">PLAT SEUL</h3>
            <p className="text-2xl font-black mt-2">9.50 €</p>
          </button>
          <button onClick={() => {setSelectedFormule('duo'); setStep('choix-plat');}} className="p-8 bg-gray-900 text-white rounded-[40px] text-left relative shadow-xl">
            <div className="absolute top-4 right-6 bg-orange-500 px-3 py-1 rounded-full text-[9px] font-black uppercase">Populaire</div>
            <span className="text-[10px] font-black text-orange-400 uppercase">Duo</span>
            <h3 className="text-xl font-black">PLAT + BOISSON</h3>
            <p className="text-2xl font-black mt-2 text-orange-500">11.50 €</p>
          </button>
          <button onClick={() => {setSelectedFormule('trio'); setStep('choix-plat');}} className="p-8 border-2 border-gray-100 rounded-[40px] text-left hover:border-orange-500 transition-all bg-white/80 backdrop-blur-sm">
            <span className="text-[10px] font-black text-orange-500 uppercase">Trio</span>
            <h3 className="text-xl font-black">PLAT + BOISSON + DESSERT</h3>
            <p className="text-2xl font-black mt-2 text-gray-800">14.90 €</p>
          </button>
        </div>
      </div>
    </FoodBackground>
  );

  const StepView = ({ title, items, category }) => (
    <FoodBackground overlay="rgba(248,250,252,0.90)">
      <div className="min-h-screen flex flex-col">
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-black text-gray-800 leading-tight mb-2 italic uppercase">{title}</h2>
          <div className="h-1 w-20 bg-orange-500 rounded-full mb-8"></div>
          <div className="grid gap-3 overflow-y-auto max-h-[70vh] pr-2">
            {items.map(item => (
              <button key={item.id} onClick={() => selectItem(category, item)} className="bg-white/90 backdrop-blur-sm p-5 rounded-[30px] shadow-sm flex items-center gap-5 hover:scale-[1.02] active:scale-95 transition-all text-left border border-gray-100">
                <span className="text-4xl bg-gray-50 w-16 h-16 flex items-center justify-center rounded-2xl">{item.image}</span>
                <div>
                  <h4 className="font-black text-gray-800 uppercase text-xs tracking-wider">{item.name}</h4>
                  {item.cat && <p className="text-[10px] font-bold text-orange-400 uppercase mt-1">{item.cat}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="p-8 mt-auto bg-white/80 border-t backdrop-blur-sm">
          <button onClick={() => window.location.reload()} className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">Recommencer</button>
        </div>
      </div>
    </FoodBackground>
  );

  if (step === 'choix-plat') return <StepView title="Votre Plat" items={menu.plats} category="plat" />;
  if (step === 'choix-boisson') return <StepView title="Votre Boisson" items={menu.boissons} category="boisson" />;
  if (step === 'choix-dessert') return <StepView title="Votre Dessert" items={menu.desserts} category="dessert" />;

  if (step === 'recap') return (
    <FoodBackground>
      <div className="min-h-screen p-8">
        <h2 className="text-3xl font-black mb-10 italic uppercase">Récapitulatif</h2>
        <div className="bg-gray-900 text-white p-8 rounded-[40px] mb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Total Formule</span>
                <span className="text-3xl font-black tracking-tighter">{prixFormules[selectedFormule]} €</span>
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-3"><span className="text-orange-500">✔</span> <span className="font-bold text-sm uppercase">{selections.plat?.name}</span></div>
                {selections.boisson && <div className="flex items-center gap-3"><span className="text-orange-500">✔</span> <span className="font-bold text-sm uppercase">{selections.boisson?.name}</span></div>}
                {selections.dessert && <div className="flex items-center gap-3"><span className="text-orange-500">✔</span> <span className="font-bold text-sm uppercase">{selections.dessert?.name}</span></div>}
            </div>
        </div>
        <input type="text" placeholder="VOTRE PRÉNOM" className="w-full bg-white/90 p-6 rounded-3xl font-black mb-8 border-2 border-transparent focus:border-orange-500 outline-none text-center uppercase tracking-widest" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <button disabled={!customerName} onClick={() => setStep('paiement')} className="w-full bg-orange-500 text-white p-6 rounded-[35px] font-black text-xl shadow-xl disabled:bg-gray-100 transition-all uppercase italic">Valider la commande</button>
      </div>
    </FoodBackground>
  );

  if (step === 'paiement') return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-[50px] p-12 w-full text-center shadow-inner">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Montant de la transaction</p>
            <h2 className="text-5xl font-black mb-12 italic">{prixFormules[selectedFormule]} €</h2>
            {isPaying ? <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" /> : 
            <button onClick={() => { setIsPaying(true); setTimeout(() => { setOrderNumber(Math.floor(100+Math.random()*900)); setStep('confirmation'); }, 2000); }} className="w-full bg-blue-600 text-white p-6 rounded-[30px] font-black text-lg shadow-lg">SIMULER PAIEMENT CB</button>}
        </div>
    </div>
  );

  if (step === 'confirmation') return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-8">
        <div className="bg-white rounded-[60px] p-12 w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-green-400"></div>
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Validé !</h2>
            <p className="text-gray-400 text-xs font-bold mb-10 leading-relaxed uppercase">Merci {customerName}, rendez-vous au ScanEat Truck</p>
            <div className="bg-gray-50 p-10 rounded-[45px] border-2 border-dashed border-gray-200 mb-10">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Code Retrait</p>
                <div className="text-7xl font-black text-gray-900">#{orderNumber}</div>
            </div>
            <button onClick={() => window.location.reload()} className="text-gray-300 font-bold uppercase text-[9px] tracking-widest">Nouvelle Commande</button>
        </div>
    </div>
  );

  return null;
};

// Montage Final
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ScanEatApp />);
}