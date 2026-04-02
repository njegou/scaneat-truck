const { useState, useMemo } = React;

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [currentPage, setCurrentPage] = useState('menu');
  const [selectedFormule, setSelectedFormule] = useState(null); // 'solo', 'duo' (Plat+Boisson), 'trio' (Entrée+Plat+Boisson)
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  
  const [bookingsPerSlot] = useState({ "12:15": 8, "12:30": 7, "13:00": 3 });

  // --- CARTE COMPLÈTE AVEC BOISSONS ---
  const menuItems = {
    salades: [
      { id: 10, name: 'Salade César', price: 9.50, image: '🥗', category: 'plat' },
      { id: 11, name: 'Salade Chèvre Chaud', price: 9.50, image: '🐐', category: 'plat' },
      { id: 12, name: 'Salade Méditerranéenne', price: 9.00, image: '🍅', category: 'plat' }
    ],
    pates: [
      { id: 1, name: 'Pâtes Carbonara', price: 9.50, image: '🍝', category: 'plat' },
      { id: 2, name: 'Pâtes Bolognaise', price: 9.50, image: '🍅', category: 'plat' },
      { id: 3, name: 'Pâtes Pesto', price: 9.50, image: '🌿', category: 'plat' }
    ],
    boissons: [
      { id: 40, name: 'Eau Minérale', price: 2.00, image: '💧', category: 'boisson' },
      { id: 41, name: 'Coca-Cola', price: 2.50, image: '🥤', category: 'boisson' },
      { id: 42, name: 'Thé Glacé Maison', price: 3.00, image: '🍹', category: 'boisson' },
      { id: 43, name: 'Limonade Artisanale', price: 3.00, image: '🍋', category: 'boisson' }
    ],
    desserts: [
      { id: 30, name: 'Tiramisu Maison', price: 5.00, image: '🍰', category: 'dessert' },
      { id: 31, name: 'Panna Cotta Coco', price: 4.50, image: '🍮', category: 'dessert' }
    ]
  };

  // --- LOGIQUE DE PRIX DES FORMULES ---
  const calculateTotal = useMemo(() => {
    if (!selectedFormule || selectedFormule === 'solo') {
        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { final: total.toFixed(2), label: "À la carte" };
    }
    
    // Prix fixes pour les formules (Exemples stratégiques)
    const prixFormules = {
        'duo': 11.50, // Plat + Boisson
        'trio': 14.90  // Plat + Boisson + Dessert/Entrée
    };
    
    return { final: prixFormules[selectedFormule].toFixed(2), label: `Formule ${selectedFormule.toUpperCase()}` };
  }, [cart, selectedFormule]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 11; h <= 14; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 11 && m < 30) continue;
        if (h === 14 && m > 30) break;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  }, []);

  // --- COMPOSANTS ---
  const Header = ({ showBack }) => (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md p-5 border-b flex items-center justify-between">
      {showBack ? (
        <button onClick={() => {setCurrentPage('menu'); setSelectedFormule(null); setCart([]);}} className="text-orange-600 font-bold">← Reset</button>
      ) : <h1 className="font-black italic text-xl uppercase tracking-tighter">ScanEat<span className="text-orange-500">.</span></h1>}
      <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold">LIVE TRUCK</div>
    </div>
  );

  // --- PAGE 1 : CHOIX FORMULE ---
  const FormuleSelector = () => (
    <div className="p-6 bg-slate-50 min-h-screen">
        <Header />
        <div className="mt-10 space-y-6">
            <h2 className="text-3xl font-black leading-tight text-gray-800">Bienvenue !<br/><span className="text-orange-500">Choisissez votre faim.</span></h2>
            
            <div className="grid gap-4 mt-8">
                <button onClick={() => {setSelectedFormule('solo'); setCurrentPage('menu');}} className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-transparent hover:border-orange-500 text-left transition-all group">
                    <span className="text-2xl block mb-2">🍕</span>
                    <h3 className="font-bold text-lg">À la carte</h3>
                    <p className="text-gray-400 text-sm">Liberté totale sur vos choix</p>
                </button>

                <button onClick={() => {setSelectedFormule('duo'); setCurrentPage('menu');}} className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-transparent hover:border-orange-500 text-left transition-all relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">BEST-SELLER</div>
                    <span className="text-2xl block mb-2">🥤</span>
                    <h3 className="font-bold text-lg">Formule Duo <span className="text-orange-500 ml-2">11.50€</span></h3>
                    <p className="text-gray-400 text-sm">1 Plat + 1 Boisson au choix</p>
                </button>

                <button onClick={() => {setSelectedFormule('trio'); setCurrentPage('menu');}} className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-transparent hover:border-orange-500 text-left transition-all">
                    <span className="text-2xl block mb-2">🍰</span>
                    <h3 className="font-bold text-lg">Formule Trio <span className="text-orange-500 ml-2">14.90€</span></h3>
                    <p className="text-gray-400 text-sm">1 Plat + 1 Boisson + 1 Dessert</p>
                </button>
            </div>
        </div>
    </div>
  );

  const MenuPage = () => (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <Header showBack />
      <div className="p-5">
        <div className="bg-gray-900 text-white p-4 rounded-2xl mb-8 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest">{calculateTotal.label}</span>
            <span className="font-black text-xl text-orange-400">{calculateTotal.final} €</span>
        </div>

        {Object.entries(menuItems).map(([cat, items]) => (
          <section key={cat} className="mb-8">
            <h2 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-4 ml-1">{cat}</h2>
            <div className="grid gap-3">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl bg-orange-50 w-12 h-12 flex items-center justify-center rounded-xl">{item.image}</span>
                    <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                  </div>
                  <button onClick={() => setCart([...cart, item])} className="bg-gray-900 text-white w-10 h-10 rounded-xl font-bold">+</button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
          <button onClick={() => setCurrentPage('cart')} className="w-full bg-orange-500 text-white p-5 rounded-2xl shadow-2xl flex justify-between font-bold italic uppercase tracking-tighter">
            <span>Valider ma sélection</span>
            <span>{calculateTotal.final} €</span>
          </button>
        </div>
      )}
    </div>
  );

  const CartPage = () => (
    <div className="min-h-screen bg-white p-6">
      <Header showBack />
      <h2 className="text-3xl font-black my-8">Dernière étape</h2>
      <input type="text" placeholder="Ton Prénom" className="w-full bg-gray-50 p-4 rounded-2xl mb-8 outline-none border-2 border-transparent focus:border-orange-500 text-lg transition-all" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      <div className="space-y-4 mb-10">
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-700">
            <span>• {item.name}</span>
            <span className="text-gray-300">Inclus</span>
          </div>
        ))}
      </div>
      <button disabled={!customerName || cart.length === 0} onClick={() => setCurrentPage('time')} className="w-full bg-orange-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl disabled:bg-gray-100">RÉSERVER MON CRÉNEAU</button>
    </div>
  );

  const TimePage = () => (
    <div className="min-h-screen bg-slate-50 p-6 text-center">
      <Header showBack />
      <h2 className="text-2xl font-black my-8 italic uppercase text-gray-800">Horaire de retrait</h2>
      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map(time => {
          const left = 8 - (bookingsPerSlot[time] || 0);
          return (
            <button key={time} disabled={left <= 0} onClick={() => setSelectedTime(time)} className={`p-4 rounded-2xl border-2 transition-all relative ${selectedTime === time ? 'border-orange-500 bg-orange-50 scale-105' : 'bg-white border-transparent shadow-sm'}`}>
              <span className="text-sm font-black">{time}</span>
              {left > 0 && left <= 2 && <span className="absolute -top-2 bg-red-600 text-white text-[7px] px-1.5 py-0.5 rounded-full animate-pulse font-black italic">VITE</span>}
            </button>
          );
        })}
      </div>
      {selectedTime && <button onClick={() => setCurrentPage('payment')} className="w-full bg-gray-900 text-white p-5 rounded-2xl font-black mt-10 shadow-2xl tracking-widest">PROCÉDER AU PAIEMENT</button>}
    </div>
  );

  const PaymentPage = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[40px] p-8 w-full max-w-sm shadow-inner">
        <h2 className="text-4xl font-black mb-10 text-gray-900 tracking-tighter">{calculateTotal.final} €</h2>
        {isPaying ? <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div> : 
        <button onClick={() => { setIsPaying(true); setTimeout(() => { setOrderNumber(Math.floor(100+Math.random()*900)); setIsPaying(false); setCurrentPage('confirmation'); }, 2000); }} className="w-full bg-blue-600 text-white py-5 rounded-[28px] font-black shadow-lg">PAYER SÉCURISÉ</button>}
      </div>
    </div>
  );

  const ConfirmationPage = () => (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[50px] p-10 w-full max-w-sm shadow-2xl border-b-8 border-orange-600">
        <h2 className="text-3xl font-black mb-6 text-gray-900 tracking-tighter">C'est validé, {customerName} !</h2>
        <div className="bg-slate-50 border-2 border-dashed border-gray-200 rounded-[35px] p-8 mb-8">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">VOTRE CODE TRUCK</span>
          <div className="text-6xl font-black text-gray-900 tracking-tighter">#{orderNumber}</div>
          <div className="mt-4 font-bold text-orange-600 italic">Retrait prévu à {selectedTime}</div>
        </div>
        <button onClick={() => window.location.reload()} className="text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-orange-500 transition-colors">Commander à nouveau</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto shadow-2xl min-h-screen bg-white">
      {!selectedFormule && <FormuleSelector />}
      {selectedFormule && currentPage === 'menu' && <MenuPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'time' && <TimePage />}
      {currentPage === 'payment' && <PaymentPage />}
      {currentPage === 'confirmation' && <ConfirmationPage />}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<ScanEatApp />);
}