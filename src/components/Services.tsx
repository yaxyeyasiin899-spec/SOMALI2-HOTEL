import React, { useState } from 'react';
import { ViewState } from '../App';
import { Coffee, Utensils, ChefHat, ShoppingBag, X, CheckCircle, ArrowLeft, Waves, Dumbbell, Wifi, Car, Plane, Presentation, Shirt } from 'lucide-react';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Coffee & Tea', 'Desserts'];

const MENU_ITEMS = [
  // Breakfast
  { id: 'f1', category: 'Breakfast', name: 'Canjeero & Suqaar', price: 12, description: 'Traditional Somali pancake served with tender diced beef suqaar, drizzled with sesame oil.', image: 'https://images.unsplash.com/photo-1590552362575-d856037bcecc?auto=format&fit=crop&q=80&w=800' },
  { id: 'f2', category: 'Breakfast', name: 'Foul Medames', price: 10, description: 'Classic Arabic breakfast of slow-cooked fava beans with olive oil, cumin, and fresh bread.', image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800' },
  { id: 'f3', category: 'Breakfast', name: 'Continental Breakfast', price: 18, description: 'Assorted pastries, fresh fruits, eggs your way, and premium coffee or tea.', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800' },
  
  // Lunch
  { id: 'f4', category: 'Lunch', name: 'Bariis Iskukaris & Hilib', price: 22, description: 'Fragrant Somali spiced rice served with slow-roasted tender goat meat and bisbaas.', image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800' },
  { id: 'f5', category: 'Lunch', name: 'Chicken Mandi', price: 20, description: 'Traditional Yemeni dish of spiced rice and incredibly tender slow-cooked chicken.', image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=800' },
  { id: 'f6', category: 'Lunch', name: 'Grilled Salmon', price: 28, description: 'Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables.', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800' },
  
  // Dinner
  { id: 'f7', category: 'Dinner', name: 'Pasta Saldata', price: 16, description: 'Somali-style pasta perfectly sautéed with rich tomato sauce, vegetables, and tender beef.', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800' },
  { id: 'f8', category: 'Dinner', name: 'Lamb Kebab', price: 24, description: 'Charcoal-grilled minced lamb skewers seasoned with Arabic spices, served with fresh naan.', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800' },
  { id: 'f9', category: 'Dinner', name: 'Ribeye Steak', price: 38, description: 'Premium 12oz ribeye steak cooked to your liking, with mashed potatoes and peppercorn sauce.', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=800' },
  
  // Drinks
  { id: 'f10', category: 'Drinks', name: 'Fresh Mango Juice', price: 6, description: 'Freshly squeezed ripe mangoes with no added sugar.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800' },
  { id: 'f11', category: 'Drinks', name: 'Lemon Mint', price: 7, description: 'Refreshing blended ice drink with fresh lemons and mint leaves.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800' },
  
  // Coffee & Tea
  { id: 'f12', category: 'Coffee & Tea', name: 'Somali Shaah', price: 4, description: 'Traditional spiced black tea brewed with cardamom, cinnamon, and cloves.', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800' },
  { id: 'f13', category: 'Coffee & Tea', name: 'Arabic Coffee', price: 5, description: 'Lightly roasted coffee infused with cardamom, served with fresh dates.', image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800' },
  
  // Desserts
  { id: 'f14', category: 'Desserts', name: 'Basbousa', price: 8, description: 'Sweet semolina cake soaked in fragrant syrup, topped with almonds.', image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&q=80&w=800' },
  { id: 'f15', category: 'Desserts', name: 'Tiramisu', price: 10, description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800' },
];

const FACILITIES = [
  { icon: Utensils, name: 'Restaurant & Dining', desc: 'World-class cuisine with local and international flavors.' },
  { icon: Waves, name: 'Swimming Pool', desc: 'Olympic size outdoor pool for ultimate relaxation.' },
  { icon: Dumbbell, name: 'Gym', desc: 'Fully equipped modern fitness center.' },
  { icon: Wifi, name: 'Free Wi-Fi', desc: 'High-speed internet access across the hotel.' },
  { icon: Car, name: 'Parking', desc: 'Secure and complimentary valet parking.' },
  { icon: Shirt, name: 'Laundry', desc: 'Same-day professional laundry and dry cleaning.' },
  { icon: Plane, name: 'Airport Transfer', desc: 'Luxury shuttle service to and from the airport.' },
  { icon: Presentation, name: 'Conference Hall', desc: 'State-of-the-art halls for meetings and events.' },
];

export default function Services({ setView }: { setView: (v: ViewState) => void }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof MENU_ITEMS[0] | null>(null);
  
  // Order Form State
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success'>('idle');
  const [orderForm, setOrderForm] = useState({
    guestName: localStorage.getItem('userName') || '',
    roomNumber: '',
    phone: localStorage.getItem('userPhone') || '',
    quantity: 1,
    specialInstructions: ''
  });

  const filteredMenu = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  const handleOrderClick = (item: typeof MENU_ITEMS[0]) => {
    if (!localStorage.getItem('isLoggedIn')) {
      setView('login');
      return;
    }
    setSelectedItem(item);
    setShowOrderModal(true);
    setOrderStatus('idle');
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus('success');
    // After 3 seconds, close the modal
    setTimeout(() => {
      setShowOrderModal(false);
      setOrderStatus('idle');
      setOrderForm(prev => ({ ...prev, roomNumber: '', quantity: 1, specialInstructions: '' }));
    }, 3000);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[350px] w-full bg-hotel-darker flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-c6a4d27ece08?auto=format&fit=crop&q=80&w=2000" 
            alt="Hotel Services" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h1 className="text-4xl md:text-5xl text-white font-['Playfair_Display'] font-bold mb-4 tracking-wide uppercase">
            Services & Amenities
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-200 leading-relaxed font-light">
            Experience unparalleled luxury and comfort with our premium facilities.
          </p>
        </div>
      </div>

      {/* Facilities Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-gold font-semibold tracking-widest uppercase text-sm mb-2">Explore</h4>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] text-hotel-darker">Premium Facilities</h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {FACILITIES.map((facility, idx) => {
              const Icon = facility.icon;
              return (
                <div key={idx} className="p-6 bg-slate-50 border border-gray-100 hover:border-gold hover:shadow-lg transition-all duration-300 group cursor-default text-center rounded-sm">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold transition-colors duration-300 shadow-sm">
                    <Icon size={28} className="text-gold group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-['Playfair_Display'] font-bold text-hotel-darker mb-2">{facility.name}</h3>
                  <p className="text-sm text-gray-500">{facility.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Restaurant Section Divider */}
      <section className="py-20 bg-hotel-darker text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <ChefHat size={48} className="text-gold mx-auto mb-6" />
          <h2 className="text-4xl font-['Playfair_Display'] mb-4">Restaurant & Room Service</h2>
          <p className="text-gray-300 text-lg font-light leading-relaxed">
            Enjoy delicious Somali, Arabic, and international cuisine prepared by our professional chefs. 
            Guests staying at Mubarik Hotel can order food and drinks directly to their rooms.
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-gold text-hotel-darker shadow-md' 
                  : 'bg-transparent text-gray-500 hover:text-gold hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredMenu.map(item => (
            <div key={item.id} className="bg-white group overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-sm shadow-sm">
                  <span className="text-gold-dark font-bold">${item.price}</span>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-hotel-darker group-hover:text-gold transition-colors">
                    {item.name}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3">
                  {item.description}
                </p>
                
                <button 
                  onClick={() => handleOrderClick(item)}
                  className="w-full py-3 border-2 border-gold text-gold font-semibold uppercase tracking-wider text-sm hover:bg-gold hover:text-hotel-darker transition-colors flex items-center justify-center rounded-sm"
                >
                  <ShoppingBag size={16} className="mr-2" />
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room Service Order Modal */}
      {showOrderModal && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-hotel-darker/80 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-hotel-darker p-4 flex justify-between items-center shrink-0">
              <h2 className="text-gold font-['Playfair_Display'] text-2xl font-bold flex items-center">
                <Utensils className="mr-2" /> Room Service
              </h2>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="text-white hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 md:p-8">
              {orderStatus === 'success' ? (
                <div className="text-center py-10 animate-fade-in">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-['Playfair_Display'] font-bold text-hotel-darker mb-2">
                    Order Received!
                  </h3>
                  <p className="text-gray-600">
                    Your order has been received and will be delivered to your room shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-5">
                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-sm mb-6 flex items-center">
                    <img src={selectedItem.image} alt={selectedItem.name} className="w-16 h-16 object-cover rounded-sm mr-4" />
                    <div>
                      <h4 className="font-bold text-hotel-darker">{selectedItem.name}</h4>
                      <p className="text-gold font-semibold">${selectedItem.price} each</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Guest Name</label>
                      <input 
                        type="text" 
                        required
                        value={orderForm.guestName}
                        onChange={(e) => setOrderForm({...orderForm, guestName: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm rounded-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Room Number</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 402"
                        value={orderForm.roomNumber}
                        onChange={(e) => setOrderForm({...orderForm, roomNumber: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm rounded-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        max="10"
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm rounded-sm transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm rounded-sm transition-colors"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-1">Special Instructions</label>
                      <textarea 
                        rows={3}
                        placeholder="Any allergies or specific requests?"
                        value={orderForm.specialInstructions}
                        onChange={(e) => setOrderForm({...orderForm, specialInstructions: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm rounded-sm transition-colors resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Total</p>
                      <p className="text-2xl font-bold text-hotel-darker">${(selectedItem.price * orderForm.quantity).toFixed(2)}</p>
                    </div>
                    <button 
                      type="submit"
                      className="bg-gold hover:bg-gold-light text-hotel-darker px-8 py-3 font-bold uppercase tracking-wider transition-colors rounded-sm"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
