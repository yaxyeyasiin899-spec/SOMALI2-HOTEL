import React, { useState } from 'react';
import { ViewState } from '../App';
import { Coffee, Utensils, ChefHat, ShoppingBag, X, CheckCircle, ArrowLeft, Waves, Dumbbell, Wifi, Car, Plane, Presentation, Shirt } from 'lucide-react';

const FACILITIES = [
  { icon: Waves, name: 'Swimming Pool', desc: 'Olympic size outdoor pool for ultimate relaxation.' },
  { icon: Dumbbell, name: 'Gym', desc: 'Fully equipped modern fitness center.' },
  { icon: Wifi, name: 'Free Wi-Fi', desc: 'High-speed internet access across the hotel.' },
  { icon: Car, name: 'Parking', desc: 'Secure and complimentary valet parking.' },
  { icon: Shirt, name: 'Laundry', desc: 'Same-day professional laundry and dry cleaning.' },
  { icon: Plane, name: 'Airport Transfer', desc: 'Luxury shuttle service to and from the airport.' },
  { icon: Presentation, name: 'Conference Hall', desc: 'State-of-the-art halls for meetings and events.' },
];

export default function Services({ setView }: { setView: (v: ViewState) => void }) {
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
    </div>
  );
}
