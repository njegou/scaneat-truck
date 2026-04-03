// --- MISE À JOUR DE LA LOGIQUE DES CRÉNEAUX DANS APP.JS ---

// 1. Ajoutez cet état dans votre composant ScanEatApp
const [bookings, setBookings] = useState({
  "12:15": 8, // Exemple de créneau complet pour le test
  "12:30": 5
});

// 2. Fonction pour générer les créneaux (à mettre dans useMemo)
const timeSlots = useMemo(() => {
  const slots = [];
  let start = 11 * 60 + 30; // 11:30 en minutes
  const end = 14 * 60 + 30;  // 14:30 en minutes
  while (start <= end) {
    const h = Math.floor(start / 60);
    const m = start % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    start += 15;
  }
  return slots;
}, []);

// 3. Nouvelle Vue : TimeSelectionPage
const TimeSelectionPage = () => (
  <FoodBackground photo="visuel_scaneat_truck_2.png">
    <div className="min-h-screen p-8 flex flex-col text-center">
      <h2 className="text-3xl font-black mb-2 italic uppercase text-white">Heure de retrait</h2>
      <p className="text-white/50 text-[10px] uppercase tracking-widest mb-8">Capacité limitée à 8 commandes par créneau</p>
      
      <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[60vh] p-2">
        {timeSlots.map(time => {
          const count = bookings[time] || 0;
          const isFull = count >= 8;
          return (
            <button
              key={time}
              disabled={isFull}
              onClick={() => { setSelectedTime(time); setStep('paiement'); }}
              className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center ${
                selectedTime === time 
                  ? 'border-orange-500 bg-orange-500 text-white' 
                  : isFull 
                    ? 'border-white/5 bg-white/5 opacity-20 cursor-not-allowed' 
                    : 'border-white/10 bg-white/10 text-white hover:border-orange-500'
              }`}
            >
              <span className="text-lg font-black">{time}</span>
              <span className="text-[8px] font-bold uppercase mt-1">
                {isFull ? 'Complet' : `${8 - count} dispos`}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-auto pt-6">
        <button onClick={() => setStep('recap')} className="text-white/30 font-bold uppercase text-[10px] tracking-widest">Retour au récapitulatif</button>
      </div>
    </div>
  </FoodBackground>
);