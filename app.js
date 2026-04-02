const { useState, useEffect, useMemo } = React;

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [currentPage, setCurrentPage] = useState('menu');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  
  // Simulation des réservations pour le pilotage des flux (Capacité max : 8)
  const [bookingsPerSlot] = useState({
    "12:15": 8, // Complet
    "12:30": 7, // Urgence : Plus que 1 !
    "12:45": 6, // Urgence : Plus que 2 !
    "13:00": 3
  });

  // --- CARTE MISE À JOUR (Source: image_42952e.png) ---
  const menuItems = {
    salades: [
      { id: 10, name: 'Salade César', price: 9.50, image: '🥗', category: 'plat' },
      { id: 11, name: 'Salade Chèvre Chaud', price: 9.50, image: '🐐', category: 'plat' },
      { id: 12, name: 'Salade Méditerranéenne', price: 9.00, image: '🍅', category: 'plat' },
      { id: 13, name: 'Salade Composée', price: 8.50, image: '🥬', category: 'plat' }
    ],
    pates: [
      { id: 1, name: 'Pâtes Carbonara', price: 9.50, image: '🍝', category: 'plat' },
      { id: 2, name: 'Pâtes Bolognaise', price: 9.50, image: '🍅', category: 'plat' },
      { id: 3, name: 'Pâtes Pesto', price: 9.50, image: '🌿', category: 'plat' },
      { id: 4, name: 'Pâtes Arrabbiata', price: 9.00, image: '🌶️', category: 'plat' }
    ],
    pokebowls: [
      { id: 5, name: 'Poke Saumon', price: 11.50, image: '🐟', category: 'plat' },
      { id: 6, name: 'Poke Thon', price: 11.50, image: '🍣', category: 'plat' },
      { id: 7, name: 'Poke Poulet Teriyaki', price: 10.50, image: '🍗', category: 'plat' },
      { id: 8, name: 'Poke Végétarien', price: 10.00, image: '🥑', category: 'plat' }
    ],
    desserts: [
      { id: 30, name: 'Tiramisu Maison', price: 5.00, image: '🍰', category: 'dessert' },
      { id: 31, name: 'Panna Cotta Coco', price: 4.50, image: '🍮', category: 'dessert' }
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

  const calculateTotal = useMemo(() => {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    // Formule : -2€ si [Plat + Dessert]
    const hasPlat = cart.some(i => i.category === 'plat');
    const hasDessert = cart.some(i => i.category === 'dessert');
    let discount = (hasPlat && hasDessert) ? 2.00 : 0;
    return { 
      subtotal: total.toFixed(2), 
      discount: discount.toFixed(2), 
      final: (total - discount).toFixed(2) 
    };
  }, [cart]);

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setOrderNumber(Math.floor(100 + Math.random() * 900));
      setIsPaying(false);
      setCurrentPage('confirmation');
    }, 2500);
  };

  // --- COMPOSANTS INTERFACE ---
  const Header = ({ showBack }) => (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md p-5 border-b border-orange-100 flex items-center justify-between">
      {showBack ? (
        <button onClick={() => setCurrentPage('menu')} className="text-orange-600 font-bold flex items-center gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Retour
        </button>
      ) : <h1 className="font-black italic text-xl tracking-tighter uppercase">ScanEat<span className="text-orange-500">.</span></h1>}
      <div className="w-10" />
    </div>
  );

  // --- PAGES ---
  const MenuPage = () => (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <Header />
      <div className="p-5 space-y-10">
        {Object.entries(menuItems).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4 ml-1">{category}</h2>
            <div className="grid gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-orange-50 w-14 h-14 flex items-center justify-center rounded-xl">{item.image}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                      <p className="text-orange-600 font-bold text-xs">{item.price.toFixed(2)} €</p>
                    </div>
                  </div>
                  <button onClick={() => addToCart(item)} className="bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors">
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
          <button onClick={() => setCurrentPage('cart')} className="w-full bg-gray-900 text-white p-5 rounded-2xl shadow-2xl flex justify-between items-center font-bold">
            <span className="flex items-center gap-2">
              <span className="bg-orange-500 text-[10px] px-2 py-0.5 rounded-full">{cart.length}</span>
              Voir mon panier
            </span>
            <span>{calculateTotal.final} €</span>
          </button>
        </div>
      )}
    </div>
  );

  const CartPage = () => (
    <div className="min-h-screen bg-white">
      <Header showBack />
      <div className="p-6">
        <h2 className="text-3xl font-black mb-8">Ma commande</h2>
        <div className="mb-8">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Identité du client</label>
          <input 
            type="text" 
            placeholder="Saisissez votre prénom" 
            className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none text-lg"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="space-y-4 mb-10">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-4">
              <span className="font-bold text-gray-700">{item.quantity}x {item.name}</span>
              <span className="text-gray-400">{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
        </div>
        {parseFloat(calculateTotal.discount) > 0 && (
          <div className="bg-green-50 p-4 rounded-2xl mb-6 flex justify-between items-center text-green-700 font-bold text-sm">
            <span>🔥 Remise Formule appliquée</span>
            <span>-{calculateTotal.discount} €</span>
          </div>
        )}
        <button 
          disabled={!customerName || cart.length === 0}
          onClick={() => setCurrentPage('time')}
          className="w-full bg-orange-500 text-white p-5 rounded-2xl font-bold text-lg shadow-lg disabled:bg-gray-200 transition-all"
        >
          Choisir l'heure de retrait
        </button>
      </div>
    </div>
  );

  const TimePage = () => (
    <div className="min-h-screen bg-slate-50">
      <Header showBack />
      <div className="p-6 text-center">
        <h2 className="text-2xl font-black mb-2 italic uppercase">Planification</h2>
        <p className="text-gray-400 text-sm mb-10 tracking-tight">Sélectionnez votre créneau de retrait au camion.</p>
        <div className="grid grid-cols-2 gap-4">
          {["12:00", "12:15", "12:30", "12:45", "13:00", "13:15"].map(time => {
            const bookings = bookingsPerSlot[time] || 0;
            const spotsLeft = 8 - bookings;
            const isFull = spotsLeft <= 0;
            const isUrgent = spotsLeft > 0 && spotsLeft <= 2;

            return (
              <button
                key={time}
                disabled={isFull}
                onClick={() => setSelectedTime(time)}
                className={`p-6 rounded-[30px] border-2 transition-all relative flex flex-col items-center ${
                  selectedTime === time ? 'border-orange-500 bg-orange-50 scale-105' : 'border-transparent bg-white shadow-sm'
                } ${isFull ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
              >
                <span className="text-xl font-black text-gray-800">{time}</span>
                {isUrgent && (
                  <span className="absolute -top-2 bg-red-600 text-white text-[9px] px-3 py-1 rounded-full font-black animate-pulse">
                    PLUS QUE {spotsLeft} !
                  </span>
                )}
                <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">{isFull ? 'Complet' : 'Disponible'}</span>
              </button>
            );
          })}
        </div>
        {selectedTime && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => setCurrentPage('payment')} className="w-full bg-gray-900 text-white p-5 rounded-2xl font-bold text-lg shadow-2xl">
              Confirmer pour {selectedTime}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const PaymentPage = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-10 text-gray-300">
          <span className="text-[10px] font-black uppercase tracking-widest">Secure Terminal v.2026</span>
          <div className="flex gap-2">📶 💳</div>
        </div>
        <div className="text-center mb-12">
          <p className="text-gray-400 text-xs font-bold uppercase mb-2">Montant de la transaction</p>
          <h2 className="text-5xl font-black text-gray-900">{calculateTotal.final} €</h2>
        </div>
        {isPaying ? (
          <div className="flex flex-col items-center py-4">
            <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-orange-500 font-black animate-pulse text-sm">TRANSACTION EN COURS...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 p-4 rounded-3xl text-center text-[10px] text-gray-400 font-bold uppercase leading-relaxed">
              Présentez votre smartphone <br/> ou votre carte bancaire
            </div>
            <button onClick={handlePayment} className="w-full bg-blue-600 text-white py-5 rounded-[25px] font-black text-lg hover:bg-blue-700 transition-colors">
              PAYER MAINTENANT
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const ConfirmationPage = () => (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-[50px] p-10 w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-green-400"></div>
        <div className="text-6xl mb-6">🍕</div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">C'est validé !</h2>
        <p className="text-gray-400 text-sm font-medium mb-8 leading-snug">Merci {customerName}, votre commande est en préparation.</p>
        <div className="bg-slate-50 border-2 border-gray-100 rounded-[35px] p-8 mb-10">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">Code de Retrait</span>
          <div className="text-6xl font-black text-gray-900 tracking-tighter">#{orderNumber}</div>
          <div className="mt-6 bg-orange-100 text-orange-600 inline-block px-4 py-1 rounded-full text-xs font-bold">
            Rendez-vous à {selectedTime}
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="text-gray-300 hover:text-gray-900 font-bold text-xs uppercase tracking-widest transition-colors">Retour au menu</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto shadow-2xl min-h-screen font-sans selection:bg-orange-100">
      {currentPage === 'menu' && <MenuPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'time' && <TimePage />}
      {currentPage === 'payment' && <PaymentPage />}
      {currentPage === 'confirmation' && <ConfirmationPage />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ScanEatApp />);