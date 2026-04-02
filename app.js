const { useState, useMemo } = React;

const ScanEatApp = () => {
  const [currentPage, setCurrentPage] = useState('menu');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  
  const [bookingsPerSlot] = useState({ "12:15": 8, "12:30": 7, "13:00": 3 });

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

  const calculateTotal = useMemo(() => {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const hasPlat = cart.some(i => i.category === 'plat');
    const hasDessert = cart.some(i => i.category === 'dessert');
    let discount = (hasPlat && hasDessert) ? 2.00 : 0;
    return { final: (total - discount).toFixed(2), discount: discount.toFixed(2) };
  }, [cart]);

  const Header = ({ showBack }) => (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md p-5 border-b flex items-center justify-between shadow-sm">
      {showBack ? (
        <button onClick={() => setCurrentPage('menu')} className="text-orange-600 font-bold">← Retour</button>
      ) : <h1 className="font-black italic text-xl uppercase tracking-tighter">ScanEat<span className="text-orange-500">.</span></h1>}
      <div className="w-10" />
    </div>
  );

  const MenuPage = () => (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <Header />
      <div className="p-5 space-y-8">
        {Object.entries(menuItems).map(([cat, items]) => (
          <section key={cat}>
            <h2 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-4 ml-1">{cat}</h2>
            <div className="grid gap-3">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between active:scale-95 transition-transform">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl bg-orange-50 w-14 h-14 flex items-center justify-center rounded-xl">{item.image}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.name}</h3>
                      <p className="text-orange-600 font-bold text-xs">{item.price.toFixed(2)} €</p>
                    </div>
                  </div>
                  <button onClick={() => setCart([...cart, {...item, quantity: 1}])} className="bg-gray-900 text-white w-10 h-10 rounded-xl flex items-center justify-center">+</button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
          <button onClick={() => setCurrentPage('cart')} className="w-full bg-gray-900 text-white p-5 rounded-2xl shadow-2xl flex justify-between font-bold animate-bounce-short">
            <span>Voir mon panier ({cart.length})</span>
            <span>{calculateTotal.final} €</span>
          </button>
        </div>
      )}
    </div>
  );

  const CartPage = () => (
    <div className="min-h-screen bg-white p-6">
      <Header showBack />
      <h2 className="text-3xl font-black my-8">Finaliser</h2>
      <input type="text" placeholder="Ton Prénom" className="w-full bg-gray-50 p-4 rounded-2xl mb-8 outline-none focus:ring-2 focus:ring-orange-500 text-lg" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      <div className="space-y-4 mb-10">
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between border-b pb-4 text-sm font-bold text-gray-700">
            <span>{item.name}</span>
            <span>{item.price.toFixed(2)} €</span>
          </div>
        ))}
      </div>
      <button disabled={!customerName || cart.length === 0} onClick={() => setCurrentPage('time')} className="w-full bg-orange-500 text-white p-5 rounded-2xl font-bold text-lg shadow-lg disabled:bg-gray-200">Continuer</button>
    </div>
  );

  const TimePage = () => (
    <div className="min-h-screen bg-slate-50 p-6 text-center">
      <Header showBack />
      <h2 className="text-2xl font-black my-8 uppercase italic">Horaire</h2>
      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map(time => {
          const left = 8 - (bookingsPerSlot[time] || 0);
          return (
            <button key={time} disabled={left <= 0} onClick={() => setSelectedTime(time)} className={`p-4 rounded-2xl border-2 transition-all relative ${selectedTime === time ? 'border-orange-500 bg-orange-50 scale-105' : 'bg-white'}`}>
              <span className="text-sm font-black">{time}</span>
              {left > 0 && left <= 2 && <span className="absolute -top-2 bg-red-600 text-white text-[7px] px-1.5 py-0.5 rounded-full animate-pulse font-black">VITE !</span>}
            </button>
          );
        })}
      </div>
      {selectedTime && <button onClick={() => setCurrentPage('payment')} className="w-full bg-gray-900 text-white p-5 rounded-2xl font-bold mt-10 shadow-2xl">Payer</button>}
    </div>
  );

  const PaymentPage = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[40px] p-8 w-full max-w-sm">
        <h2 className="text-4xl font-black mb-10">{calculateTotal.final} €</h2>
        {isPaying ? <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div> : 
        <button onClick={() => { setIsPaying(true); setTimeout(() => { setOrderNumber(Math.floor(100+Math.random()*900)); setIsPaying(false); setCurrentPage('confirmation'); }, 2000); }} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black">PAYER</button>}
      </div>
    </div>
  );

  const ConfirmationPage = () => (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[50px] p-10 w-full max-w-sm shadow-2xl">
        <h2 className="text-2xl font-black mb-6">Merci {customerName} !</h2>
        <div className="bg-slate-50 border-2 border-dashed rounded-[35px] p-8 mb-8">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Code de Retrait</span>
          <div className="text-6xl font-black text-gray-900">#{orderNumber}</div>
          <div className="mt-4 font-bold text-orange-600 italic">RDV à {selectedTime}</div>
        </div>
        <button onClick={() => window.location.reload()} className="text-gray-300 font-bold text-[10px] uppercase">Retour</button>
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