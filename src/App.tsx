/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Admin from './components/Admin';
import Booking from './components/Booking';
import Profile from './components/Profile';
import Services from './components/Services';

export type ViewState = 'home' | 'login' | 'admin' | 'booking' | 'profile' | 'services';

export default function App() {
  const [view, setView] = useState<ViewState>(() => {
    return localStorage.getItem('isLoggedIn') ? 'home' : 'home';
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter']">
      {view !== 'admin' && <Navbar view={view} setView={setView} />}
      
      <main className="flex-grow">
        {view === 'home' && <Home setView={setView} />}
        {view === 'login' && <Login setView={setView} />}
        {view === 'admin' && <Admin setView={setView} />}
        {view === 'booking' && <Booking setView={setView} />}
        {view === 'profile' && <Profile setView={setView} />}
        {view === 'services' && <Services setView={setView} />}
      </main>

      {view !== 'admin' && <Footer />}
    </div>
  );
}
