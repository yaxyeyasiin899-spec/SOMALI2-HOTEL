import React, { useState, useEffect } from 'react';
import { Menu, X, User, Crown } from 'lucide-react';
import { ViewState } from '../App';

interface NavbarProps {
  view: ViewState;
  setView: (v: ViewState) => void;
}

export default function Navbar({ view, setView }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const navLinks = [
    { name: 'Home', id: 'home', view: 'home' },
    { name: 'About', id: 'about', view: 'home' },
    { name: 'Rooms', id: 'rooms', view: 'home' },
    { name: 'Restaurant', id: 'restaurant', view: 'home' },
    { name: 'Services', view: 'services' },
    { name: 'Gallery', id: 'gallery', view: 'home' },
    { name: 'Contact', id: 'contact', view: 'home' },
  ];

  const handleNavClick = (link: {id?: string, view?: string}) => {
    setMenuOpen(false);
    if (link.view && link.view !== 'home' && link.view !== 'booking') {
      setView(link.view as ViewState);
    } else if (view !== 'home' && view !== 'booking') {
      setView('home');
    }
    
    if (link.id) {
      setTimeout(() => {
        const el = document.getElementById(link.id!);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleBookNow = () => {
    if (localStorage.getItem('isLoggedIn')) {
      setView('booking');
      setMenuOpen(false);
    } else {
      setView('login');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userPhoto');
    setView('login');
    setMenuOpen(false);
  };

  const bgClass = scrolled || view !== 'home' || menuOpen ? 'bg-hotel-darker py-4 shadow-lg' : 'bg-transparent py-6';

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 min-h-[3rem]">
            
            {/* Left: Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer flex items-center group" 
              onClick={() => handleNavClick({id: 'home', view: 'home'})}
            >
              <Crown className="text-gold w-6 h-6 sm:w-8 sm:h-8 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-gold text-2xl sm:text-3xl font-bold font-['Playfair_Display'] tracking-wider">SOMALI</span>
              <span className="text-white text-2xl sm:text-3xl font-light font-['Playfair_Display'] ml-2">HOTEL</span>
            </div>

            {/* Right: Menu, Book Now & Profile */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="hidden sm:flex items-center text-[11px] font-semibold tracking-[0.2em] uppercase text-white/90">
                {localStorage.getItem('isLoggedIn') ? (
                  <button onClick={() => setView('profile')} className="flex items-center hover:text-gold transition-colors">
                    <User size={14} className="mr-1" /> PROFILE
                  </button>
                ) : (
                  <button onClick={() => setView('login')} className="flex items-center hover:text-gold transition-colors">
                    <User size={14} className="mr-1" /> LOGIN
                  </button>
                )}
              </div>
              <div className="flex flex-col items-center space-y-1">
                <button 
                  onClick={handleBookNow} 
                  className="bg-gold hover:bg-gold-light text-hotel-darker px-4 sm:px-6 py-2 text-[11px] font-bold uppercase transition-colors rounded-sm tracking-[0.15em]"
                >
                  BOOK NOW
                </button>
                {localStorage.getItem('isAdmin') === 'true' && (
                  <button 
                    onClick={() => { setView('admin'); setMenuOpen(false); }} 
                    className="bg-gray-800 hover:bg-gray-700 text-gold px-4 sm:px-6 py-1.5 text-[9px] font-bold uppercase transition-colors rounded-sm tracking-[0.15em] w-full"
                  >
                    ADMIN
                  </button>
                )}
              </div>

              <button 
                onClick={() => setMenuOpen(!menuOpen)} 
                className="flex items-center text-white hover:text-gold transition-colors group ml-2 sm:ml-4"
              >
                <span className="hidden sm:block text-[11px] font-semibold tracking-[0.2em] uppercase mr-2">
                  {menuOpen ? 'Close' : 'Menu'}
                </span>
                {menuOpen ? (
                  <X size={28} className="group-hover:scale-110 transition-transform" />
                ) : (
                  <Menu size={28} className="group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-hotel-darker z-40 transition-transform duration-500 ease-in-out flex items-center justify-center ${
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between h-full pt-28 pb-10 overflow-y-auto">
          <div className="flex flex-col space-y-6 text-center w-full">
            {navLinks.map((link, index) => (
              <button 
                key={link.name} 
                onClick={() => handleNavClick(link)} 
                className="text-2xl font-['Playfair_Display'] font-light tracking-widest uppercase text-white hover:text-gold transition-colors w-fit mx-auto"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.name}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col space-y-8 text-center w-full mt-12 border-t border-white/10 pt-8">
            <div>
              <h4 className="text-gold font-semibold tracking-widest uppercase text-xs mb-4">Contact Us</h4>
              <p className="text-gray-300 text-sm mb-2">Maka Al-Mukarama Road</p>
              <p className="text-gray-300 text-sm mb-2">Mogadishu, Somalia</p>
              <p className="text-gray-300 text-sm mb-2">+252 61 000 0000</p>
              <p className="text-gray-300 text-sm">info@somalihotel.com</p>
            </div>
            
            <div>
              <h4 className="text-gold font-semibold tracking-widest uppercase text-xs mb-4">Account</h4>
              <div className="flex flex-col space-y-4 items-center">
                {localStorage.getItem('isLoggedIn') ? (
                  <>
                    {localStorage.getItem('isAdmin') === 'true' && (
                      <button onClick={() => { setView('admin'); setMenuOpen(false); }} className="text-white hover:text-gold uppercase tracking-[0.2em] text-xs font-semibold">
                        Admin Dashboard
                      </button>
                    )}
                    <button onClick={() => { setView('profile'); setMenuOpen(false); }} className="text-white hover:text-gold uppercase tracking-[0.2em] text-xs font-semibold">
                      My Profile
                    </button>
                    <button onClick={handleLogout} className="text-white hover:text-gold uppercase tracking-[0.2em] text-xs font-semibold">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setView('login'); setMenuOpen(false); }} className="text-white hover:text-gold uppercase tracking-[0.2em] text-xs font-semibold">
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
