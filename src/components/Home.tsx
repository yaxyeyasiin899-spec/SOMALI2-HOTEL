import React, { useState } from 'react';
import { Calendar, Users, CheckCircle, Wifi, Coffee, Dumbbell, Waves, Utensils, Star, MapPin, BedDouble, Plane, Headset } from 'lucide-react';
import { ViewState } from '../App';

import { ROOMS } from '../data';


const REVIEWS = [
  { name: 'Sarah Johnson', location: 'UK', text: 'Absolutely incredible stay. The staff was attentive and the room was pure luxury.', rating: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { name: 'Ahmed Ali', location: 'Somalia', text: 'Best hotel in the city. The presidential suite exceeded all expectations.', rating: 5, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { name: 'Michael Chen', location: 'USA', text: 'Great food, fast wifi, and very comfortable beds. Highly recommended.', rating: 4, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
];

export default function Home({ setView }: { setView: (v: ViewState) => void }) {
  const [bookingStatus, setBookingStatus] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('Searching availability...');
    setTimeout(() => setBookingStatus('Rooms available! Please select from the list below.'), 1500);
  };

  const handleBookNow = () => {
    if (localStorage.getItem('isLoggedIn')) {
      setView('booking');
    } else {
      setView('login');
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1920&q=80" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-hotel-darker/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-hotel-darker/90 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto -mt-16">
          <p className="text-gold font-['Playfair_Display'] italic text-xl md:text-2xl mb-4">Luxury and Comfort Redefined</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-['Playfair_Display'] mb-2 leading-tight">
            Welcome To
          </h1>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gold font-['Playfair_Display'] mb-6 leading-tight uppercase tracking-wide">
            SOMALI HOTEL
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
            Experience luxury and comfort like never before.<br/>
            Enjoy world class service and unforgettable moments with us.
          </p>
        </div>

        {/* Booking Search Box floating over hero bottom */}
        <div className="absolute bottom-0 left-0 w-full translate-y-1/2 px-4 sm:px-6 lg:px-8 z-20">
          <div className="max-w-6xl mx-auto bg-white rounded-sm shadow-2xl flex flex-col md:flex-row items-center p-4">
            <form onSubmit={handleSearch} className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div className="px-4 py-2 border-r border-gray-100 last:border-0 md:border-r">
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center"><Calendar size={14} className="mr-1"/> Check-in</label>
                <input type="date" className="w-full bg-transparent text-sm text-gray-500 focus:outline-none" required />
              </div>
              <div className="px-4 py-2 border-r border-gray-100 last:border-0 md:border-r">
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center"><Calendar size={14} className="mr-1"/> Check-out</label>
                <input type="date" className="w-full bg-transparent text-sm text-gray-500 focus:outline-none" required />
              </div>
              <div className="px-4 py-2 border-r border-gray-100 last:border-0 md:border-r">
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center"><Users size={14} className="mr-1"/> Guests</label>
                <select className="w-full bg-transparent text-sm text-gray-500 focus:outline-none appearance-none">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                </select>
              </div>
              <div className="px-4 py-2 border-r border-gray-100 last:border-0 md:border-r">
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center"><BedDouble size={14} className="mr-1"/> Room</label>
                <select className="w-full bg-transparent text-sm text-gray-500 focus:outline-none appearance-none">
                  <option>Select room</option>
                  {ROOMS.map(room => (
                    <option key={room.id} value={room.name}>{room.name}</option>
                  ))}
                </select>
              </div>
              <div className="px-4 py-2">
                <button type="button" onClick={handleBookNow} className="w-full bg-gold hover:bg-gold-light text-hotel-darker py-3 px-6 font-bold uppercase tracking-wider transition-colors rounded-sm text-sm">
                  BOOK NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="pt-40 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-['Playfair_Display'] text-hotel-darker font-bold">Why Choose Us</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div className="flex flex-col items-center">
              <BedDouble size={40} strokeWidth={1} className="text-gray-700 mb-4" />
              <h3 className="text-sm font-semibold text-gray-800">Luxury Rooms</h3>
            </div>
            <div className="flex flex-col items-center">
              <Wifi size={40} strokeWidth={1} className="text-gray-700 mb-4" />
              <h3 className="text-sm font-semibold text-gray-800">Free Wi-Fi</h3>
            </div>
            <div className="flex flex-col items-center">
              <Utensils size={40} strokeWidth={1} className="text-gray-700 mb-4" />
              <h3 className="text-sm font-semibold text-gray-800">Restaurant</h3>
            </div>
            <div className="flex flex-col items-center">
              <Plane size={40} strokeWidth={1} className="text-gray-700 mb-4" />
              <h3 className="text-sm font-semibold text-gray-800">Airport Pickup</h3>
            </div>
            <div className="flex flex-col items-center">
              <Headset size={40} strokeWidth={1} className="text-gray-700 mb-4" />
              <h3 className="text-sm font-semibold text-gray-800">24/7 Support</h3>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-gold font-semibold tracking-widest uppercase text-sm mb-2">About Us</h4>
              <h2 className="text-4xl font-['Playfair_Display'] text-hotel-darker mb-6">Experience A <br/>New Vision Of Luxury</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Somali Hotel provides luxury accommodation with world-class hospitality. Located in the heart of the city, we offer an oasis of calm and refinement. Our dedicated staff is committed to ensuring your stay is nothing short of extraordinary.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                From our elegantly appointed rooms to our award-winning dining options, every detail has been carefully curated to provide you with an unforgettable experience.
              </p>
              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-3xl font-['Playfair_Display'] text-gold">150+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Luxury Rooms</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-['Playfair_Display'] text-gold">4.9</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Guest Rating</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" alt="Hotel Lobby" className="w-full h-auto object-cover rounded-sm shadow-xl" />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 shadow-lg hidden md:block">
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=250&q=80" alt="Detail" className="w-48 h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-gold font-semibold tracking-widest uppercase text-sm mb-2">Our Accommodation</h4>
            <h2 className="text-4xl font-['Playfair_Display'] text-hotel-darker">Rooms & Suites</h2>
            <div className="w-24 h-1 bg-gold mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROOMS.map(room => (
              <div key={room.id} className="group bg-slate-50 border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-hotel-darker text-gold px-3 py-1 text-sm font-semibold">
                    ${room.price} <span className="text-xs font-normal text-gray-300">/ Night</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-['Playfair_Display'] font-bold text-hotel-darker mb-3">{room.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 h-10 line-clamp-2">{room.desc}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center"><Users size={14} className="text-gold mr-1" /> {room.guests} Guests</div>
                    <div className="flex items-center"><CheckCircle size={14} className="text-gold mr-1" /> {room.bed}</div>
                    <div className="flex items-center"><CheckCircle size={14} className="text-gold mr-1" /> {room.size}</div>
                    <div className="flex items-center"><Wifi size={14} className="text-gold mr-1" /> Free Wifi</div>
                  </div>
                  
                  <button onClick={handleBookNow} className="w-full py-3 border border-gold text-gold hover:bg-gold hover:text-hotel-darker font-semibold text-sm uppercase tracking-wider transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Section */}
      <section id="restaurant" className="py-24 bg-hotel-darker text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" alt="Restaurant Interior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="order-1 lg:order-2">
              <h4 className="text-gold font-semibold tracking-widest uppercase text-sm mb-2">Culinary Experience</h4>
              <h2 className="text-4xl font-['Playfair_Display'] text-white mb-6">Our Restaurant <br/>& Cafe</h2>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                Indulge in a culinary journey at our signature restaurant. Our executive chefs prepare exquisite dishes using the finest local and international ingredients, blending traditional Somali flavors with modern gastronomy.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold mr-4">
                    <span className="font-['Playfair_Display'] italic">B</span>
                  </div>
                  <div>
                    <h5 className="font-bold tracking-wider text-sm">Breakfast</h5>
                    <p className="text-xs text-gray-400">7:00 AM - 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center text-gold mr-4">
                    <span className="font-['Playfair_Display'] italic">L</span>
                  </div>
                  <div>
                    <h5 className="font-bold tracking-wider text-sm">Lunch & Dinner</h5>
                    <p className="text-xs text-gray-400">12:00 PM - 11:00 PM</p>
                  </div>
                </div>
              </div>
              <button className="bg-transparent border border-gold text-gold hover:bg-gold hover:text-hotel-darker px-8 py-3 text-sm font-bold uppercase transition-colors tracking-widest">
                View Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold tracking-[0.2em] uppercase text-sm font-semibold mb-2 block">Moments</span>
            <h2 className="text-4xl font-['Playfair_Display'] text-hotel-darker mb-4">Our Gallery</h2>
            <div className="w-24 h-0.5 bg-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden h-[400px] md:h-[616px]">
              <img src="https://images.unsplash.com/photo-1542314831-c6a4d1424391?auto=format&fit=crop&w=1200&q=80" alt="Hotel Lobby" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-hotel-darker/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            <div className="relative group overflow-hidden h-[300px]">
              <img src="https://images.unsplash.com/photo-1582719478250-c894e4dc240e?auto=format&fit=crop&w=600&q=80" alt="Room Interior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative group overflow-hidden h-[300px]">
              <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80" alt="Dining Area" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative group overflow-hidden h-[300px]">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" alt="Fitness Center" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative group overflow-hidden h-[300px]">
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80" alt="Spa Massage" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section id="offers" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[400px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" alt="Romantic Getaway" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-hotel-darker/90 via-hotel-darker/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="bg-gold text-hotel-darker text-xs font-bold px-3 py-1 inline-block uppercase tracking-wider mb-3">25% Off</div>
                <h3 className="text-3xl font-['Playfair_Display'] text-white mb-2">Romantic Getaway</h3>
                <p className="text-white/80 text-sm mb-6 max-w-sm">Enjoy a romantic weekend with champagne, spa treatments, and late checkout.</p>
                <button className="text-gold border-b border-gold pb-1 hover:text-white hover:border-white transition-colors uppercase text-sm font-semibold tracking-wider">Book Offer</button>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80" alt="Spa Package" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-hotel-darker/90 via-hotel-darker/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="bg-gold text-hotel-darker text-xs font-bold px-3 py-1 inline-block uppercase tracking-wider mb-3">Spa Included</div>
                <h3 className="text-3xl font-['Playfair_Display'] text-white mb-2">Wellness Package</h3>
                <p className="text-white/80 text-sm mb-6 max-w-sm">Rejuvenate your body and mind with our exclusive 3-day wellness retreat.</p>
                <button className="text-gold border-b border-gold pb-1 hover:text-white hover:border-white transition-colors uppercase text-sm font-semibold tracking-wider">Book Offer</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h4 className="text-gold font-semibold tracking-widest uppercase text-sm mb-2">Testimonials</h4>
            <h2 className="text-4xl font-['Playfair_Display'] text-hotel-darker">Guest Reviews</h2>
            <div className="w-24 h-1 bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review, idx) => (
              <div key={idx} className="bg-slate-50 p-8 border border-gray-100 relative">
                <div className="text-gold flex mb-4">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 italic mb-6">"{review.text}"</p>
                <div className="flex items-center">
                  <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <div>
                    <h4 className="font-semibold text-hotel-darker text-sm">{review.name}</h4>
                    <span className="text-xs text-gray-500">{review.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map Placeholder */}
      <section id="contact" className="py-0 relative h-[500px] flex items-center bg-gray-200">
        <div className="absolute inset-0 bg-hotel-darker/10">
          {/* Simple map representation */}
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold uppercase tracking-widest">
            Interactive Map Area
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end">
          <div className="bg-white p-8 shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-['Playfair_Display'] text-hotel-darker mb-6">Get In Touch</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm" />
              <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm resize-none"></textarea>
              <button type="button" className="w-full bg-gold hover:bg-gold-light text-hotel-darker py-3 font-semibold uppercase tracking-wider text-sm transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
