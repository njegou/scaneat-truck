const { useState, useEffect, useMemo } = React;

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [currentPage, setCurrentPage] = useState('menu');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  
  // Simulation de créneaux déjà réservés (8 = complet)
  const [bookingsPerSlot, setBookingsPerSlot] = useState({
    "12:15": 8, // Déjà plein pour le test
    "13:00": 5,
    "12:30": 3
  });

  // --- DONNÉES DU MENU ---
  const menuItems = {
    entrees: [
      { id: 20, name: 'Salade Verte', price: 4.50, image: '🥗', category: 'entree' },
      { id: 21, name: 'Bruschetta Ail', price: 5.50, image: '🍞', category: 'entree' }
    ],
    plats: [
      { id: 1, name: 'Carbonara', description: 'Crème, parmesan, œuf', price: 9.50, image: '🍝', category: 'plat' },
      { id: 5, name: 'Saumon Poke', description: 'Riz, saumon, avocat', price: 11.50, image: '🥗', category: 'plat' },
      { id: 9, name: 'César', description: 'Poulet, croûtons, sauce', price: 9.50, image: '🥗', category: 'plat' }
    ],
    desserts: [
      { id: 30, name: 'Tiramisu', price: 5.00, image: '🍰', category: 'dessert' },
      { id: 31, name: 'Panna Cotta', price: 4.50, image: '🍮', category: 'dessert' }
    ]
  };

  // --- LOGIQUE COMMERCIALE ---
  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Calcul du prix avec détection de Formule (-2€ si Entrée+Plat ou Plat+Dessert)
  const calculateTotal = useMemo(() => {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Logique simplifiée de formule : on compte les types
    const hasEntree = cart.some(i => i.category === 'entree');
    const hasPlat = cart.some(i => i.category === 'plat');
    const hasDessert = cart.some(i => i.category === 'dessert');

    let discount = 0;
    if (hasPlat && (hasEntree || hasDessert)) discount = 2.00;
    
    return { 
      subtotal: total.toFixed(2), 
      discount: discount.toFixed(2), 
      final: (total - discount).toFixed(2) 
    };
  }, [cart]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 11; h <= 14; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 11 && m < 30) continue;
        if (h === 14 && m > 30) break;
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  // --- COMPOSANTS UI ---
  const Header = ({ title, showBack }) => (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 p-5 flex items-center justify-between">
      {showBack ? (
        <button onClick={() => setCurrentPage('menu')} className="p-2 hover:bg-orange-50 rounded-full transition-colors">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
      ) : <div className="w-10" />}
      <h1 className="text-xl font-black tracking-tight text-gray-800 uppercase italic">ScanEat<span className="text-orange-500">.</span></h1>
      <div className="w-10" />
    </div>
  );

  // --- PAGES ---
  const MenuPage = () => (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <Header title="Menu" />
      <div className="p-5 space-y-8">
        {Object.entries(menuItems).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4 ml-1">{category}</h2>
            <div className="grid gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-orange-50 w-14 h-14 flex items-center justify-center rounded-xl">{item.image}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-orange-500 font-medium">{item.price.toFixed(2)} €</p>
                    </div>
                  </div>
                  <button onClick={() => addToCart(item)} className="bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
          <button onClick={() => setCurrentPage('cart')} className="w-full bg-gray-900 text-white p-5 rounded-2xl shadow-2xl flex justify-between items-center animate-bounce-short">
            <span className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">{cart.length}</span>
              Voir le panier
            </span>
            <span className="font-bold">{calculateTotal.final} €</span>
          </button>
        </div>
      )}
    </div>
  );

  const CartPage = () => (
    <div className="min-h-screen bg-white">
      <Header showBack />
      <div className="p-6">
        <h2 className="text-3xl font-black mb-8">Mon Panier</h2>
        <div className="space-y-6 mb-10">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
              <div>
                <h4 className="font-bold text-lg">{item.name}</h4>
                <p className="text-gray-400 text-sm">{item.quantity} x {item.price.toFixed(2)} €</p>
              </div>
              <div className="flex items-center gap-4 bg-gray-100 rounded-full px-3 py-1">
                <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-gray-400">×</button>
                <span className="font-bold">{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {parseFloat(calculateTotal.discount) > 0 && (
          <div className="bg-green-50 p-4 rounded-xl mb-6 flex justify-between items-center text-green-700">
            <span className="text-sm font-medium">🔥 Remise Formule appliquée</span>
            <span className="font-bold">-{calculateTotal.discount} €</span>
          </div>
        )}

        <div className="space-y-4 mb-32">
          <input 
            type="text" 
            placeholder="Ton Prénom" 
            className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none text-lg"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <button 
            disabled={!customerName || cart.length === 0}
            onClick={() => setCurrentPage('time')}
            className="w-full bg-orange-500 text-white p-5 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 disabled:bg-gray-200"
          >
            Choisir l'heure de retrait
          </button>
        </div>
      </div>
    </div>
  );

  const TimePage = () => {
    const slots = generateTimeSlots();
    return (
      <div className="min-h-screen bg-slate-50">
        <Header showBack />
        <div className="p-6">
          <h2 className="text-2xl font-black mb-2">À quelle heure ?</h2>
          <p className="text-gray-500 mb-8">Les créneaux grisés sont déjà complets.</p>
          
          <div className="grid grid-cols-3 gap-3">
            {slots.map(time => {
              const count = bookingsPerSlot[time] || 0;
              const isFull = count >= 8;
              
              return (
                <button
                  key={time}
                  disabled={isFull}
                  onClick={() => setSelectedTime(time)}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    isFull ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' : 
                    selectedTime === time ? 'bg-gray-900 text-white scale-105 shadow-xl' : 'bg-white text-gray-800'
                  }`}
                >
                  <span className="block font-bold">{time}</span>
                  <span className="text-[10px] uppercase tracking-tighter">{isFull ? 'Complet' : 'Libre'}</span>
                </button>
              );
            })}
          </div>

          <div className="fixed bottom-6 left-0 right-0 p-6">
            <button 
              onClick={() => {
                setOrderNumber(Math.floor(100 + Math.random() * 900));
                setCurrentPage('confirmation');
              }}
              disabled={!selectedTime}
              className="w-full bg-orange-500 text-white p-5 rounded-2xl font-bold text-lg disabled:opacity-50"
            >
              Confirmer pour {selectedTime}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmationPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-orange-500 p-6">
      <div className="bg-white rounded-[40px] p-10 w-full max-w-sm text-center shadow-2xl">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-black mb-2">C'est prêt (bientôt) !</h2>
        <p className="text-gray-500 mb-6">Merci {customerName}, ta commande est enregistrée.</p>
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-6 mb-8">
          <span className="text-gray-400 text-xs uppercase font-bold tracking-widest">Numéro de retrait</span>
          <div className="text-5xl font-black text-gray-900 mt-2">#{orderNumber}</div>
          <div className="mt-4 text-orange-600 font-bold">Rendez-vous à {selectedTime}</div>
        </div>
        <button onClick={() => window.location.reload()} className="text-gray-400 font-medium hover:text-gray-900 transition-colors">Retour à l'accueil</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto shadow-2xl min-h-screen">
      {currentPage === 'menu' && <MenuPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'time' && <TimePage />}
      {currentPage === 'confirmation' && <ConfirmationPage />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ScanEatApp />);