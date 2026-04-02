const { useState, useEffect, useMemo } = React;

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [currentPage, setCurrentPage] = useState('menu');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  
  // Simulation des réservations (8 = max)
  const [bookingsPerSlot] = useState({
    "12:15": 8, // Complet
    "12:30": 7, // Plus que 1 !
    "12:45": 6, // Plus que 2 !
    "13:00": 3
  });

  // --- VOTRE CARTE RÉELLE ---
  const menuItems = {
    entrees: [
      { id: 20, name: 'Salade Verte', price: 4.50, image: '🥗', category: 'entree' },
      { id: 21, name: 'Bruschetta Ail', price: 5.50, image: '🍞', category: 'entree' }
    ],
    plats: [
      { id: 1, name: 'Pâtes Carbonara', description: 'Crème, parmesan, guanciale', price: 9.50, image: '🍝', category: 'plat' },
      { id: 5, name: 'Saumon Poke Bowl', description: 'Riz, saumon frais, avocat', price: 11.50, image: '🍱', category: 'plat' },
      { id: 9, name: 'Salade César', description: 'Poulet croustillant, sauce maison', price: 9.50, image: '🥗', category: 'plat' }
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
    const hasPlat = cart.some(i => i.category === 'plat');
    const hasSide = cart.some(i => i.category === 'entree' || i.category === 'dessert');
    let discount = (hasPlat && hasSide) ? 2.00 : 0;
    return { final: (total - discount).toFixed(2), discount };
  }, [cart]);

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setOrderNumber(Math.floor(100 + Math.random() * 900));
      setIsPaying(false);
      setCurrentPage('confirmation');
    }, 2500); // Simulation temps de transaction
  };

  // --- COMPOSANTS ---
  const Header = ({ showBack }) => (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md p-5 border-b flex items-center justify-between">
      {showBack ? (
        <button onClick={() => setCurrentPage('menu')} className="text-orange-600 font-bold">← Retour</button>
      ) : <span className="font-black italic text-xl">ScanEat<span className="text-orange-500">.</span></span>}
      <div className="w-8" />
    </div>
  );

  // --- PAGES ---
  const MenuPage = () => (
    <div className="pb-32 bg-gray-50 min-h-screen">
      <Header />
      <div className="p-5 space-y-8">
        {Object.entries(menuItems).map(([cat, items]) => (
          <section key={cat}>
            <h2 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">{cat}</h2>
            <div className="grid gap-3">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">{item.name}</h3>
                      <p className="text-orange-500 text-xs font-bold">{item.price.toFixed(2)} €</p>
                    </div>
                  </div>
                  <button onClick={() => addToCart(item)} className="bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center">+</button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6">
          <button onClick={() => setCurrentPage('cart')} className="w-full bg-gray-900 text-white p-5 rounded-2xl flex justify-between font-bold shadow-2xl">
            <span>Voir Panier ({cart.length})</span>
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
        <h2 className="text-2xl font-black mb-6">Finaliser</h2>
        <input 
          type="text" 
          placeholder="Ton Prénom" 
          className="w-full bg-gray-100 p-4 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-orange-500"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm border-b pb-2">
              <span>{item.quantity}x {item.name}</span>
              <span className="font-bold">{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
        </div>
        <button 
          disabled={!customerName || cart.length === 0}
          onClick={() => setCurrentPage('time')}
          className="w-full bg-orange-500 text-white p-5 rounded-2xl font-bold disabled:bg-gray-200 shadow-lg"
        >
          Choisir l'horaire
        </button>
      </div>
    </div>
  );

  const TimePage = () => (
    <div className="min-h-screen bg-gray-50">
      <Header showBack />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Créneaux disponibles</h2>
        <div className="grid grid-cols-2 gap-4">
          {["12:00", "12:15", "12:30", "12:45", "13:00", "13:15"].map(time => {
            const bookings = bookingsPerSlot[time] || 0;
            const left = 8 - bookings;
            return (
              <button
                key={time}
                disabled={left <= 0}
                onClick={() => setSelectedTime(time)}
                className={`p-4 rounded-2xl border-2 transition-all relative ${
                  selectedTime === time ? 'border-orange-500 bg-orange-50' : 'border-transparent bg-white'
                } ${left <= 0 ? 'opacity-40 grayscale' : ''}`}
              >
                <span className="block font-black text-lg">{time}</span>
                {left > 0 && left <= 2 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse font-bold">
                    Plus que {left} !
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selectedTime && (
          <button onClick={() => setCurrentPage('payment')} className="w-full bg-gray-900 text-white p-5 rounded-2xl font-bold mt-10">
            Passer au paiement
          </button>
        )}
      </div>
    </div>
  );

  const PaymentPage = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs font-bold text-gray-400 uppercase">Terminal de Paiement</span>
          <div className="flex gap-1 text-blue-600">💳 📶</div>
        </div>
        <div className="text-center mb-10">
          <p className="text-gray-500 text-sm mb-1">Montant à régler</p>
          <h2 className="text-4xl font-black">{calculateTotal.final} €</h2>
        </div>
        
        {isPaying ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-bold text-orange-500 animate-pulse">Communication avec la banque...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-dashed text-center text-xs text-gray-400">
              Tapez votre carte ou utilisez le sans contact
            </div>
            <button onClick={handlePayment} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700">
              Payer maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const ConfirmationPage = () => (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[40px] p-10 w-full max-w-sm shadow-2xl">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-black mb-2">Merci {customerName} !</h2>
        <p className="text-gray-500 text-sm mb-6">Ta commande est confirmée.</p>
        <div className="bg-orange-50 rounded-3xl p-6 border-2 border-dashed border-orange-200">
          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Numéro de retrait</p>
          <p className="text-5xl font-black text-gray-900">#{orderNumber}</p>
          <p className="mt-4 font-bold">Prêt à {selectedTime}</p>
        </div>
        <button onClick={() => window.location.reload()} className="mt-8 text-gray-400 text-sm font-medium underline">Nouvelle commande</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto shadow-2xl min-h-screen bg-white">
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