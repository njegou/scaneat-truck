const { useState, useMemo } = React;

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [step, setStep] = useState('selection-formule'); 
  const [selectedFormule, setSelectedFormule] = useState(null);
  const [selections, setSelections] = useState({ plat: null, boisson: null, dessert: null });
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  // Réservations par créneau — partagées en mémoire pour toute la session
  const [bookings, setBookings] = useState({
    "12:15": 8, // Créneau complet pour démonstration
    "12:30": 7,
    "13:00": 3
  });

  // --- CRÉNEAUX : 11h30 → 14h30, toutes les 15 min ---
  const timeSlots = useMemo(() => {
    const slots = [];
    let start = 11 * 60 + 30;
    const end = 14 * 60 + 30;
    while (start <= end) {
      const h = Math.floor(start / 60);
      const m = start % 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      start += 15;
    }
    return slots;
  }, []);

  // --- VOTRE CARTE COMPLÈTE ---
  const menu = {
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

  // Confirme la commande et incrémente le créneau sélectionné
  const confirmOrder = () => {
    setIsPaying(true);
    setTimeout(() => {
      setBookings(prev => ({
        ...prev,
        [selectedTime]: (prev[selectedTime] || 0) + 1
      }));
      setOrderNumber(Math.floor(100 + Math.random() * 900));
      setStep('confirmation');
    }, 2000);
  };

  // --- VUES ---
  if (step === 'selection-formule') return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center">
      <h1 className="text-4xl font-black mb-2 italic uppercase text-center text-gray-800">ScanEat<span className="text-orange-500">.</span></h1>
      <p className="text-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">Borne de commande digitale</p>
      <div className="grid gap-4">
        <button onClick={() => {setSelectedFormule('solo'); setStep('choix-plat');}} className="p-8 border-2 border-gray-100 rounded-[40px] text-left hover:border-orange-500 transition-all">
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
        <button onClick={() => {setSelectedFormule('trio'); setStep('choix-plat');}} className="p-8 border-2 border-gray-100 rounded-[40px] text-left hover:border-orange-500 transition-all">
          <span className="text-[10px] font-black text-orange-500 uppercase">Trio</span>
          <h3 className="text-xl font-black">PLAT + BOISSON + DESSERT</h3>
          <p className="text-2xl font-black mt-2 text-gray-800">14.90 €</p>
        </button>
      </div>
    </div>
  );

  const StepView = ({ title, items, category }) => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="p-8 pb-4">
        <h2 className="text-3xl font-black text-gray-800 leading-tight mb-2 italic uppercase">{title}</h2>
        <div className="h-1 w-20 bg-orange-500 rounded-full mb-8"></div>
        <div className="grid gap-3 overflow-y-auto max-h-[70vh] pr-2">
          {items.map(item => (
            <button key={item.id} onClick={() => selectItem(category, item)} className="bg-white p-5 rounded-[30px] shadow-sm flex items-center gap-5 hover:scale-[1.02] active:scale-95 transition-all text-left border border-gray-100">
              <span className="text-4xl bg-gray-50 w-16 h-16 flex items-center justify-center rounded-2xl">{item.image}</span>
              <div>
                <h4 className="font-black text-gray-800 uppercase text-xs tracking-wider">{item.name}</h4>
                {item.cat && <p className="text-[10px] font-bold text-orange-400 uppercase mt-1">{item.cat}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="p-8 mt-auto bg-white border-t">
          <button onClick={() => window.location.reload()} className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">Recommencer</button>
      </div>
    </div>
  );

  if (step === 'choix-plat') return <StepView title="Votre Plat" items={menu.plats} category="plat" />;
  if (step === 'choix-boisson') return <StepView title="Votre Boisson" items={menu.boissons} category="boisson" />;
  if (step === 'choix-dessert') return <StepView title="Votre Dessert" items={menu.desserts} category="dessert" />;

  if (step === 'recap') return (
    <div className="min-h-screen bg-white p-8">
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
      <input type="text" placeholder="VOTRE PRÉNOM" className="w-full bg-gray-50 p-6 rounded-3xl font-black mb-8 border-2 border-transparent focus:border-orange-500 outline-none text-center uppercase tracking-widest" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      <button disabled={!customerName} onClick={() => setStep('choix-creneau')} className="w-full bg-orange-500 text-white p-6 rounded-[35px] font-black text-xl shadow-xl disabled:bg-gray-100 transition-all uppercase italic">Valider la commande</button>
    </div>
  );

  // --- PAGE CHOIX DU CRÉNEAU ---
  if (step === 'choix-creneau') {
    const MAX_PER_SLOT = 8;
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white px-8 pt-10 pb-6 border-b border-gray-100">
          <h2 className="text-3xl font-black text-gray-800 italic uppercase leading-tight">Heure de retrait</h2>
          <div className="h-1 w-20 bg-orange-500 rounded-full mt-2 mb-3"></div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Capacité limitée à {MAX_PER_SLOT} commandes par créneau
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map(time => {
              const count = bookings[time] || 0;
              const isFull = count >= MAX_PER_SLOT;
              const isSelected = selectedTime === time;
              const remaining = MAX_PER_SLOT - count;

              return (
                <button
                  key={time}
                  disabled={isFull}
                  onClick={() => setSelectedTime(time)}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1
                    ${isSelected
                      ? 'border-orange-500 bg-orange-500 text-white shadow-lg scale-[1.04]'
                      : isFull
                        ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-orange-400 hover:shadow-md active:scale-95'
                    }`}
                >
                  <span className="text-lg font-black tracking-tight">{time}</span>
                  <span className={`text-[9px] font-black uppercase tracking-wider
                    ${isSelected ? 'text-white/80' : isFull ? 'text-gray-300' : 'text-orange-500'}`}>
                    {isFull ? 'Complet' : `${remaining} dispo${remaining > 1 ? 's' : ''}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border-t border-gray-100 p-6 flex flex-col gap-3">
          {selectedTime && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 flex items-center justify-between">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Créneau sélectionné</span>
              <span className="text-xl font-black text-gray-800">{selectedTime}</span>
            </div>
          )}
          <button
            disabled={!selectedTime}
            onClick={() => setStep('paiement')}
            className="w-full bg-orange-500 text-white p-5 rounded-[30px] font-black text-lg shadow-xl disabled:bg-gray-100 disabled:text-gray-300 transition-all uppercase italic"
          >
            Confirmer ce créneau
          </button>
          <button onClick={() => setStep('recap')} className="text-gray-300 font-bold uppercase text-[10px] tracking-widest text-center pt-1">
            ← Retour au récapitulatif
          </button>
        </div>
      </div>
    );
  }

  if (step === 'paiement') return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-[50px] p-12 w-full text-center shadow-inner">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Montant de la transaction</p>
            <h2 className="text-5xl font-black mb-4 italic">{prixFormules[selectedFormule]} €</h2>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-10">Retrait à {selectedTime}</p>
            {isPaying ? <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" /> : 
            <button onClick={confirmOrder} className="w-full bg-blue-600 text-white p-6 rounded-[30px] font-black text-lg shadow-lg">SIMULER PAIEMENT CB</button>}
        </div>
    </div>
  );

  if (step === 'confirmation') return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-8">
        <div className="bg-white rounded-[60px] p-12 w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-green-400"></div>
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Validé !</h2>
            <p className="text-gray-400 text-xs font-bold mb-10 leading-relaxed uppercase">Merci {customerName}, rendez-vous au ScanEat Truck</p>
            <div className="bg-gray-900 text-white p-6 rounded-[30px] mb-4 flex items-center justify-between px-8">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Heure de retrait</span>
              <span className="text-2xl font-black text-orange-500">{selectedTime}</span>
            </div>
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

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ScanEatApp />);
}