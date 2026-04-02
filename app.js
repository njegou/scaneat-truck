const { useState, useMemo } = React;

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [step, setStep] = useState('selection-formule'); // Étapes : selection-formule, choix-plat, choix-boisson, choix-dessert, recap, paiement, confirmation
  const [selectedFormule, setSelectedFormule] = useState(null);
  const [selections, setSelections] = useState({ plat: null, boisson: null, dessert: null });
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const menu = {
    plats: [
      { id: 1, name: 'Pâtes Carbonara', image: '🍝', desc: 'Guanciale & Parmesan' },
      { id: 2, name: 'Salade César', image: '🥗', desc: 'Poulet & Croûtons' },
      { id: 3, name: 'Poke Saumon', image: '🐟', desc: 'Avocat & Riz' }
    ],
    boissons: [
      { id: 10, name: 'Eau Minérale', image: '💧' },
      { id: 11, name: 'Coca-Cola', image: '🥤' },
      { id: 12, name: 'Thé Glacé Maison', image: '🍹' }
    ],
    desserts: [
      { id: 20, name: 'Tiramisu', image: '🍰' },
      { id: 21, name: 'Panna Cotta', image: '🍮' }
    ]
  };

  const prixFormules = { solo: 9.50, duo: 11.50, trio: 14.90 };

  // --- LOGIQUE DE NAVIGATION ---
  const nextStep = () => {
    if (step === 'selection-formule') setStep('choix-plat');
    else if (step === 'choix-plat') setStep('choix-boisson');
    else if (step === 'choix-boisson') {
        if (selectedFormule === 'trio') setStep('choix-dessert');
        else setStep('recap');
    }
    else if (step === 'choix-dessert') setStep('recap');
  };

  const selectItem = (category, item) => {
    setSelections({ ...selections, [category]: item });
    nextStep();
  };

  // --- COMPOSANTS UI ---
  const ProgressBar = () => (
    <div className="flex gap-1 px-5 py-2">
      {['formule', 'plat', 'boisson', 'dessert', 'recap'].map((s, i) => (
        <div key={i} className={`h-1 flex-1 rounded-full ${i <= ['selection-formule', 'choix-plat', 'choix-boisson', 'choix-dessert', 'recap'].indexOf(step) ? 'bg-orange-500' : 'bg-gray-200'}`} />
      ))}
    </div>
  );

  // --- VUES ---
  if (step === 'selection-formule') return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center text-center">
      <h1 className="text-4xl font-black mb-4 uppercase italic">ScanEat<span className="text-orange-500">.</span></h1>
      <p className="text-gray-400 mb-10 font-bold uppercase tracking-widest text-xs">Touchez pour commander</p>
      <div className="grid gap-4">
        <button onClick={() => {setSelectedFormule('solo'); setStep('choix-plat');}} className="p-8 border-2 border-gray-100 rounded-[40px] hover:border-orange-500 transition-all text-left">
          <span className="text-xs font-bold text-orange-500 uppercase">Le Classique</span>
          <h3 className="text-xl font-black">PLAT SEUL</h3>
          <p className="text-2xl font-black mt-2">9.50 €</p>
        </button>
        <button onClick={() => {setSelectedFormule('duo'); setStep('choix-plat');}} className="p-8 bg-gray-900 text-white rounded-[40px] text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 p-2 px-4 text-[10px] font-bold">POPULAIRE</div>
          <span className="text-xs font-bold text-orange-400 uppercase">Menu Duo</span>
          <h3 className="text-xl font-black text-white">PLAT + BOISSON</h3>
          <p className="text-2xl font-black mt-2">11.50 €</p>
        </button>
        <button onClick={() => {setSelectedFormule('trio'); setStep('choix-plat');}} className="p-8 border-2 border-gray-100 rounded-[40px] hover:border-orange-500 transition-all text-left">
          <span className="text-xs font-bold text-orange-500 uppercase">Menu Complet</span>
          <h3 className="text-xl font-black">PLAT + BOISSON + DESSERT</h3>
          <p className="text-2xl font-black mt-2">14.90 €</p>
        </button>
      </div>
    </div>
  );

  const StepSelector = ({ title, items, category }) => (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ProgressBar />
      <div className="p-8 flex-1">
        <h2 className="text-3xl font-black mb-8 leading-tight">{title}</h2>
        <div className="grid gap-4">
          {items.map(item => (
            <button key={item.id} onClick={() => selectItem(category, item)} className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-6 hover:scale-[1.02] transition-transform text-left">
              <span className="text-4xl">{item.image}</span>
              <div>
                <h4 className="font-bold text-lg">{item.name}</h4>
                {item.desc && <p className="text-gray-400 text-sm">{item.desc}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="p-8 bg-white border-t">
          <button onClick={() => setStep('selection-formule')} className="text-gray-400 font-bold uppercase text-xs">Annuler la commande</button>
      </div>
    </div>
  );

  if (step === 'choix-plat') return <StepSelector title="Choisissez votre Plat" items={menu.plats} category="plat" />;
  if (step === 'choix-boisson') return <StepSelector title="Une petite soif ?" items={menu.boissons} category="boisson" />;
  if (step === 'choix-dessert') return <StepSelector title="Et pour le dessert ?" items={menu.desserts} category="dessert" />;

  if (step === 'recap') return (
    <div className="min-h-screen bg-white p-8">
      <h2 className="text-3xl font-black mb-10 italic">Récapitulatif</h2>
      <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl">
              <span className="font-bold uppercase text-xs text-gray-400">Votre Menu</span>
              <span className="font-black text-orange-500">{prixFormules[selectedFormule]} €</span>
          </div>
          <div className="px-4 space-y-4">
              <p className="font-bold">✅ {selections.plat?.name}</p>
              {selections.boisson && <p className="font-bold">✅ {selections.boisson?.name}</p>}
              {selections.dessert && <p className="font-bold">✅ {selections.dessert?.name}</p>}
          </div>
          <input type="text" placeholder="Entrez votre prénom" className="w-full bg-gray-100 p-5 rounded-2xl font-bold" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </div>
      <button disabled={!customerName} onClick={() => setStep('paiement')} className="w-full bg-orange-500 text-white p-6 rounded-[32px] font-black text-xl shadow-2xl disabled:bg-gray-100">PAYER {prixFormules[selectedFormule]} €</button>
    </div>
  );

  if (step === 'paiement') return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-[50px] p-10 w-full text-center">
            <h2 className="text-4xl font-black mb-10 italic">{prixFormules[selectedFormule]} €</h2>
            {isPaying ? <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" /> : 
            <button onClick={() => { setIsPaying(true); setTimeout(() => { setOrderNumber(Math.floor(100+Math.random()*900)); setStep('confirmation'); }, 2000); }} className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black">SIMULER PAIEMENT</button>}
        </div>
    </div>
  );

  if (step === 'confirmation') return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-8">
        <div className="bg-white rounded-[60px] p-12 w-full text-center shadow-2xl">
            <h2 className="text-3xl font-black mb-6">Merci {customerName} !</h2>
            <div className="bg-gray-50 p-8 rounded-[40px] mb-10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Numéro de retrait</p>
                <div className="text-7xl font-black">#{orderNumber}</div>
            </div>
            <button onClick={() => window.location.reload()} className="text-gray-300 font-bold uppercase text-[10px] tracking-widest">Nouvelle Commande</button>
        </div>
    </div>
  );

  return null;
};

// Montage final
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ScanEatApp />);
}