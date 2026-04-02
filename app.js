const { useState, useEffect, useMemo } = React;

const ScanEatApp = () => {
  // --- ÉTATS ---
  const [currentPage, setCurrentPage] = useState('menu');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  
  // Simulation des réservations pour le pilotage (8 max par créneau)
  const [bookingsPerSlot] = useState({
    "12:15": 8, // Exemple : Complet
    "12:30": 7, // Exemple : Plus que 1 !
    "13:00": 3
  });

  // --- CARTE MISE À JOUR (Image_42952e.png) ---
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

  // --- GÉNÉRATION DYNAMIQUE DES CRÉNEAUX (11h30 - 14h30) ---
  const timeSlots = useMemo(() => {
    const slots = [];
    let start = 11 * 60 + 30; // 11:30 en minutes
    const end = 14 * 60 + 30;  // 14:30 en minutes

    while (start <= end) {
      const h = Math.floor(start / 60);
      const m = start % 60;
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      start += 15; // Intervalle de 15 min
    }
    return slots;
  }, []);

  // --- LOGIQUE PANIER ---
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
    const hasDessert = cart.some(i => i.category === 'dessert');
    let discount = (hasPlat && hasDessert) ? 2.00 : 0;
    return { final: (total - discount).toFixed(2), discount: discount.toFixed(2) };
  }, [cart]);

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setOrderNumber(Math.floor(100 + Math.random() * 900));
      setIsPaying(false);
      setCurrentPage('confirmation');
    }, 2500);
  };

  // --- COMPOSANTS ---
  const Header = ({ showBack }) => (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md p-5 border-b flex items-center justify-between">
      {showBack ? (
        <button onClick={() => setCurrentPage('menu')} className="text-orange-600 font-bold flex items-center">
          <span className="mr-1">←</span> Retour
        </button>
      ) : <h1 className="font-black italic text-xl uppercase">ScanEat<span className="text-orange-500">.</span></h1>}
      <div className="w-10" />
    </div>
  );

  // --- PAGES ---
  const MenuPage = () => (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <Header />
      <div className="p-5 space-y-8">
        {Object.entries(menuItems).map(([cat, items]) => (
          <section key={cat}>
            <h2 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-4 ml-1">{cat}</h2>
            <div className="grid gap-3">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-orange-50 w-14 h-14 flex items-center justify-center rounded-xl">{item.image}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                      <p className="text-orange-600 font-bold text-xs">{item.price.toFixed(2)} €</p>
                    </div>
                  </div>
                  <button onClick={() => addToCart(item)} className="bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-orange-500">
                    +
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
          <button onClick={() => setCurrentPage('cart')} className="w-full bg-gray-900 text-white p-5 rounded-2xl shadow-2xl flex justify-between font-bold">
            <span>Voir mon panier ({cart.length})</span>
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
        <input 
          type="text" 
          placeholder="Ton Prénom" 
          className="w-full bg-gray-50 p-4 rounded-2xl mb-8 outline-none focus:ring-2 focus:ring-orange-500 text-lg"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <div className="space-y-4 mb-10">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between border-b pb-4 text-gray-700">
              <span className="font-bold">{item.quantity}x {item.name}</span>
              <span>{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
        </div>
        {parseFloat(calculateTotal.discount) > 0 && (
          <div className="bg-green-50 p-4 rounded-2xl mb-6 flex justify-between text-green-700 font-bold text-sm">
            <span>🎁 Remise Formule appliquée</span>
            <span>-{calculateTotal.discount} €</span>
          </div>
        )}
        <button 
          disabled={!customerName || cart.length === 0}
          onClick={() => setCurrentPage('time')}
          className="w-full bg-orange-500 text-white p-5 rounded-2xl font-bold text-lg shadow-lg disabled:bg-gray-200"
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
        <h2 className="text-2xl font-black mb-8 italic uppercase">Créneaux</h2>
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map(time => {
            const bookings = bookingsPerSlot[time] || 0;
            const left = 8 - bookings;
            const isFull = left <= 0;
            const isUrgent = left > 0 && left <= 2;

            return (
              <button
                key={time}
                disabled={isFull}
                onClick={() => setSelectedTime(time)}
                className={`p-4 rounded-2xl border-2 transition-all relative flex flex-col items-center ${
                  selectedTime === time ? 'border-orange-500 bg-orange-50 scale-105 shadow-md' : 'border-transparent bg-white shadow-sm'
                } ${isFull ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
              >
                <span className="text-sm font-black text-gray-800">{time}</span>
                {isUrgent && (
                  <span className="absolute -top-2 bg-red-600 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black animate-pulse uppercase">
                    Plus que {left} !
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {selectedTime && (
          <div className="mt-10 animate-bounce-short">
            <button onClick={() => setCurrentPage('payment')} className="w-full bg-gray-900 text-white p-5 rounded-2xl font-bold text-lg shadow-2xl">
              Confirmer pour {selectedTime}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const PaymentPage = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[40px] p-8 w-full max-w-sm">
        <p