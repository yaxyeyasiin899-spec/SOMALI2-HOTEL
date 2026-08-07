import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-hotel-darker text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div>
            <div className="flex items-center mb-6">
              <span className="text-gold text-2xl font-bold font-['Playfair_Display'] tracking-wider">SOMALI</span>
              <span className="text-white text-2xl font-light font-['Playfair_Display'] ml-2">HOTEL</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Experience luxury and comfort like never before. We offer world-class service for our valued guests in the heart of the city.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold hover:bg-gold hover:text-hotel-darker transition-colors"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold hover:bg-gold hover:text-hotel-darker transition-colors"><Twitter size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold hover:bg-gold hover:text-hotel-darker transition-colors"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold hover:bg-gold hover:text-hotel-darker transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-['Playfair_Display'] text-gold mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#rooms" className="hover:text-gold transition-colors">Rooms & Suites</a></li>
              <li><a href="#facilities" className="hover:text-gold transition-colors">Facilities</a></li>
              <li><a href="#gallery" className="hover:text-gold transition-colors">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-['Playfair_Display'] text-gold mb-6 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="text-gold mr-3 mt-1 flex-shrink-0" />
                <span>123 Luxury Avenue,<br />Mogadishu, Somalia</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-gold mr-3 flex-shrink-0" />
                <span>+252 61 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-gold mr-3 flex-shrink-0" />
                <span>info@somalihotel.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-['Playfair_Display'] text-gold mb-6 uppercase tracking-wider">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers and updates.</p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                required
              />
              <button type="submit" className="bg-gold hover:bg-gold-light text-hotel-darker px-4 py-3 font-semibold text-sm transition-colors uppercase tracking-wider">
                Subscribe
              </button>
            </form>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 Somali Hotel. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
