const { useState, useMemo } = React;

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [step, setStep] = useState('selection-formule'); 
  const [selectedFormule, setSelectedFormule] = useState(null);
  const [selections, setSelections] = useState({ entree: null, plat: null, boisson: null, dessert: null });
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  
  // Simulation de la base de données (Capacité max: 8 par créneau)
  const [bookings] = useState({
    "12:15": 8, // Exemple : COMPLET
    "12:30": 7, // Exemple : URGENCE (Plus que 1)
    "13:00": 3
  });

  const menu = {
    entrees: [{ id: 100, name: 'Salade Verte', image: '🥗' }, { id: 101, name: 'Bruschetta Ail', image: '🍞' }],
    plats: [
      { id: 10, name: 'Salade César', image: '🥗', cat: 'Salades' },
      { id: 11, name: 'Salade Chèvre Chaud', image: '🐐', cat: 'Salades' },
      { id: 12, name: 'Salade Méditerranéenne', image: '🍅', cat: 'Salades' },
      { id: 13, name: 'Salade Composée', image: '🥬', cat: 'Salades' },
      { id: 1, name: 'Pâtes Carbonara', image: '🍝', cat: 'Pâtes' },
      { id: 2, name: 'Pâtes Bolognaise', image: '🍅', cat: 'Pâtes' },
      { id: 3, name: 'Pâtes Pesto', image: '🌿', cat: 'Pâtes' },
      { id: 4, name: 'Pâtes Arrabbiata', image: '🌶️', cat: 'Pâtes' },
      { id: 5, name: 'Poke Saumon', image: '🐟', cat: 'Pokebowls' },
      { id: 6, name: 'Poke Thon', image: '🍣', cat: 'Pokebowls' },
      { id: 7, name: 'Poke Poulet Teriyaki', image: '🍗', cat: 'Pokebowls' },
      { id: 8, name: 'Poke Végétarien', image: '🥑', cat: 'Pokebowls' }
    ],
    boissons: [{ id: 40, name: 'Eau Minérale', image: '💧' }, { id: 41, name: 'Coca-Cola', image: '🥤' }, { id: 42, name: 'Thé Glacé Maison', image: '🍹' }],
    desserts: [{ id: 30, name: 'Tiramisu Maison', image: '🍰' }, { id: 31, name: 'Panna Cotta Coco', image: '🍮' }]
  };

  const prixFormules = { solo: 9.50, duo: 11.50, trio: 14.90 };

  // --- GÉNÉRATION DYNAMIQUE DES CRÉNEAUX (11h30 - 14h30) ---
  const timeSlots = useMemo(() => {
    const slots = [];
    let start = 11 * 60 + 30; // 11:30
    const end = 14 * 60 + 30;  // 14:30
    while (start <= end) {
      const h = Math.floor(start / 60);
      const m = start % 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      start += 15;
    }
    return slots;
  }, []);

  const selectItem = (category, item) => {
    setSelections(prev => ({ ...prev, [category]: item }));
    if (category === 'entree') setStep('choix-plat');
    else if (category === 'plat') setStep('choix-boisson');
    else if (category === 'boisson') {
        if (selectedFormule === 'trio') setStep('choix-dessert');
        else setStep('recap');
    }
    else if (category === 'dessert') setStep('recap');
  };

  const FoodBackground = ({ children, photo }) => (
    <div className="min-h-screen w-full relative bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${photo}')` }}>
      <div className="absolute inset-0 bg-black/85 z-10"></div>
      <div className="relative z-20">{children}</div>
    </div>
  );

  // --- PAGES ---
  if (step === 'selection-formule') return (
    <FoodBackground photo="visuel_scaneat_truck.jpg">
      <div className="min-h-screen p-8 flex flex-col justify-center text-center">
        <h1 className="text-4xl font-black mb-12 italic uppercase text-white">ScanEat<span className="text-orange-500">.</span></h1>
        <div className="grid gap-4">
          <button onClick={() => {setSelectedFormule('solo'); setStep('choix-plat');}} className="p-8 border-2 border-white/10 rounded-[40px] text-left hover:border-orange-500 bg-white/5 transition-all">
            <h3 className="text-xl font-black text-white">PLAT SEUL</h3>
            <p className="text-2xl font-black mt-2 text-orange-500">9.50 €</p>
          </button>
          <button onClick={() => {setSelectedFormule('duo'); setStep('choix-plat');}} className="p-8 bg-gray-900/80 text-white rounded-[40px] text-left border border-gray-700 relative shadow-2xl">
            <div className="absolute top-0 right-0 bg-orange-500 p-2 px-4 text-[10px] font-bold">POPULAIRE</div>
            <h3 className="text-xl font-black">PLAT + BOISSON</h3>
            <p className="text-2xl font-black mt-2 text-orange-500">11.50 €</p>
          </button>
          <button onClick={() => {setSelectedFormule('trio'); setStep('choix-entree');}} className="p-8 border-2 border-white/10 rounded-[40px] text-left hover:border-orange-500 bg-white/5">
            <h3 className="text-xl font-black text-white text-sm">ENTRÉE + PLAT + BOISSON</h3>
            <p className="text-2xl font-black mt-2 text-white/50">14.90 €</p>
          </button>
        </div>
      </div>
    </FoodBackground>
  );

  if (['choix-entree', 'choix-plat', 'choix-boisson', 'choix-dessert'].includes(step)) {
    const categories = { 'choix-entree': ['Votre Entrée', menu.entrees, 'entree'], 'choix-plat': ['Votre Plat', menu.plats, 'plat'], 'choix-boisson': ['Une Boisson ?', menu.boissons, 'boisson'], 'choix-dessert': ['Un Dessert ?', menu.desserts, 'dessert'] };
    const [title, items, cat] = categories[step];
    return (
      <FoodBackground photo="visuel_scaneat_truck_2.jpg">
        <div className="min-h-screen p-8 flex flex-col">
          <h2 className="text-3xl font-black text-white italic uppercase mb-8">{title}</h2>
          <div className="grid gap-3 overflow-y-auto max-h-[75vh]">
            {items.map(item => (
              <button key={item.id} onClick={() => selectItem(cat, item)} className="bg-white/5 p-5 rounded-[30px] flex items-center gap-5 border border-white/10 hover:border-orange-500 transition-all text-left">
                <span className="text-4xl w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl">{item.image}</span>
                <div>
                  <h4 className="font-black text-white uppercase text-xs tracking-wider">{item.name}</h4>
                  {item.cat && <p className="text-[10px] font-bold text-orange-400 uppercase mt-1">{item.cat}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </FoodBackground>
    );
  }

  if (step === 'recap') return (
    <FoodBackground photo="visuel_scaneat_truck.jpg">
      <div className="min-h-screen p-8 flex flex-col justify-center text-center">
        <h2 className="text-3xl font-black mb-10 italic uppercase text-white">Ma Commande</h2>
        <div className="bg-gray-900/90 text-white p-8 rounded-[40px] mb-8 text-left border border-gray-800">
            <p className="text-4xl font-black mb-6 border-b border-gray-800 pb-4 text-orange-500">{prixFormules[selectedFormule]} €</p>
            <div className="space-y-3 uppercase text-xs font-bold text-white/70">
                {selections.entree && <p>✔ {selections.entree.name}</p>}
                <p>✔ {selections.plat?.name}</p>
                {selections.boisson && <p>✔ {selections.boisson.name}</p>}
                {selections.dessert && <p>✔ {selections.dessert.name}</p>}
            </div>
        </div>
        <input type="text" placeholder="VOTRE PRÉNOM" className="w-full bg-white/5 p-6 rounded-3xl font-black mb-8 border-2 border-white/10 focus:border-orange-500 outline-none text-center text-white" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        <button disabled={!customerName} onClick={() => setStep('choix-horaire')} className="w-full bg-orange-500 text-white p-6 rounded-[35px] font-black text-xl uppercase italic shadow-xl disabled:opacity-20">Confirmer et Choisir l'heure</button>
      </div>
    </FoodBackground>
  );

  if (step === 'choix-horaire') return (
    <FoodBackground photo="visuel_scaneat_truck_2.jpg">
      <div className="min-h-screen p-8 flex flex-col text-center">
        <h2 className="text-3xl font-black mb-2 italic uppercase text-white">Retrait</h2>
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-10">Intervalle de 15 min - Max 8 pers.</p>
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map(time => {
            const count = bookings[time] || 0;
            const spotsLeft = 8 - count;
            const isFull = spotsLeft <= 0;
            const isUrgent = spotsLeft > 0 && spotsLeft <= 2;

            return (
              <button
                key={time}
                disabled={isFull}
                onClick={() => { setSelectedTime(time); setStep('paiement'); }}
                className={`p-4 rounded-3xl border-2 transition-all relative flex flex-col items-center ${
                  isFull ? 'opacity-20 border-white/5 bg-white/5 cursor-not-allowed' : 
                  'border-white/10 bg-white/10 text-white hover:border-orange-500'
                }`}
              >
                <span className="text-sm font-black">{time}</span>
                {isUrgent && <span className="absolute -top-2 bg-red-600 text-white text-[7px] px-2 py-0.5 rounded-full animate-pulse font-black">VITE !</span>}
                {isFull && <span className="text-[7px] text-gray-500 uppercase font-black mt-1">Plein</span>}
              </button>
            );
          })}
        </div>
      </div>
    </FoodBackground>
  );

  if (step === 'paiement') return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-[50px] p-12 w-full text-center max-w-sm">
            <h2 className="text-5xl font-black mb-12 italic text-gray-900">{prixFormules[selectedFormule]} €</h2>
            {isPaying ? <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" /> : 
            <button onClick={() => { setIsPaying(true); setTimeout(() => { setOrderNumber(Math.floor(100+Math.random()*900)); setStep('confirmation'); }, 2000); }} className="w-full bg-blue-600 text-white p-6 rounded-[30px] font-black uppercase text-sm">Payer maintenant</button>}
        </div>
    </div>
  );

  if (step === 'confirmation') return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-8 text-center">
        <div className="bg-white rounded-[60px] p-12 w-full shadow-2xl max-w-sm border-b-8 border-orange-600">
            <h2 className="text-3xl font-black mb-4 uppercase italic text-gray-900">Validé !</h2>
            <p className="text-gray-400 text-xs font-bold mb-10 leading-relaxed uppercase">Rendez-vous à {selectedTime} au ScanEat Truck</p>
            <div className="bg-gray-50 p-10 rounded-[45px] border-2 border-dashed border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Code Retrait</p>
                <div className="text-7xl font-black text-gray-900">#{orderNumber}</div>
            </div>
            <button onClick={() => window.location.reload()} className="mt-10 text-gray-300 font-bold uppercase text-[9px] tracking-widest hover:text-gray-900">Nouvelle Commande</button>
        </div>
    </div>
  );

  return null;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ScanEatApp />);