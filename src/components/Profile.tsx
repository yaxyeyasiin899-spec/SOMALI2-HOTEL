import React, { useState, useEffect } from 'react';
import { ViewState } from '../App';
import { User, Mail, Phone, Calendar, CheckCircle, XCircle, ArrowLeft, Edit2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, orderBy, serverTimestamp } from 'firebase/firestore';

export default function Profile({ setView }: { setView: (v: ViewState) => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [profileData, setProfileData] = useState({
    name: auth.currentUser?.displayName || localStorage.getItem('userName') || '',
    email: auth.currentUser?.email || localStorage.getItem('userEmail') || '',
    phone: localStorage.getItem('userPhone') || '',
    photo: auth.currentUser?.photoURL || localStorage.getItem('userPhoto') || '',
  });

  useEffect(() => {
    if (activeTab === 'bookings' && auth.currentUser) {
      const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
          // Note: using orderBy without index might fail if where + orderBy are on different fields
          // Just simple where for now, to ensure it works without custom index
          const q = query(collection(db, 'bookings'), where('userId', '==', auth.currentUser?.uid));
          const querySnapshot = await getDocs(q);
          const userBookings: any[] = [];
          querySnapshot.forEach((d) => {
            userBookings.push({ id: d.id, ...d.data() });
          });
          // sort locally
          userBookings.sort((a, b) => b.createdAt - a.createdAt);
          setBookings(userBookings);
        } catch (e) {
          console.error("Error fetching bookings:", e);
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [activeTab]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', profileData.name);
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('userPhone', profileData.phone);
    setIsEditing(false);
  };

  const cancelBooking = async (id: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (e) {
      console.error("Failed to cancel booking:", e);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <button onClick={() => setView('home')} className="flex items-center text-hotel-darker hover:text-gold transition-colors font-semibold">
            <ArrowLeft size={20} className="mr-2" /> Back to Home
          </button>
        </div>

        <div className="bg-white rounded-sm shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 bg-hotel-darker text-white p-6 md:min-h-[500px]">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {profileData.photo ? (
                  <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-gold" />
                )}
              </div>
              <h3 className="text-xl font-['Playfair_Display'] font-bold text-center">{profileData.name || 'Guest User'}</h3>
            </div>
            
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-sm flex items-center transition-colors ${activeTab === 'profile' ? 'bg-gold text-hotel-darker font-semibold' : 'hover:bg-white/5 text-gray-300'}`}
              >
                <User size={18} className="mr-3" /> My Profile
              </button>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left px-4 py-3 rounded-sm flex items-center transition-colors ${activeTab === 'bookings' ? 'bg-gold text-hotel-darker font-semibold' : 'hover:bg-white/5 text-gray-300'}`}
              >
                <Calendar size={18} className="mr-3" /> Booking History
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 md:p-12">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-['Playfair_Display'] text-hotel-darker font-bold">Personal Information</h2>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="flex items-center text-gold hover:text-gold-light font-semibold">
                      <Edit2 size={16} className="mr-1" /> Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm rounded-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm rounded-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm rounded-sm"
                      />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button type="submit" className="bg-gold hover:bg-gold-light text-hotel-darker px-6 py-2 font-bold uppercase tracking-wider rounded-sm transition-colors text-sm">
                        Save Changes
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-300 text-gray-600 font-bold uppercase tracking-wider rounded-sm hover:bg-gray-50 transition-colors text-sm">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8 max-w-lg">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-4 shrink-0">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Full Name</p>
                        <p className="text-lg text-gray-900">{profileData.name || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-4 shrink-0">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Email Address</p>
                        <p className="text-lg text-gray-900">{profileData.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mr-4 shrink-0">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">Phone Number</p>
                        <p className="text-lg text-gray-900">{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-3xl font-['Playfair_Display'] text-hotel-darker font-bold mb-8">Booking History</h2>
                
                <div className="space-y-6">
                  {loadingBookings ? (
                    <div className="text-center py-12 text-gray-500">Loading bookings...</div>
                  ) : bookings.length > 0 ? bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-hotel-darker font-['Playfair_Display']">{booking.roomType}</h4>
                          <p className="text-sm text-gray-500 mt-1">Booking ID: {booking.id.substring(0, 8)}...</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                          <span className="text-lg font-bold text-gold">${booking.totalAmount}</span>
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 mt-2 rounded-sm ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Check-in</p>
                          <p className="text-sm font-medium">{booking.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Check-out</p>
                          <p className="text-sm font-medium">{booking.checkOut}</p>
                        </div>
                      </div>

                      {booking.status === 'confirmed' && (
                        <div className="flex justify-end">
                          <button 
                            onClick={() => cancelBooking(booking.id)}
                            className="flex items-center text-red-500 hover:text-red-700 text-sm font-semibold transition-colors"
                          >
                            <XCircle size={16} className="mr-1" /> Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-12 bg-gray-50 rounded-sm border border-gray-100">
                      <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">You don't have any bookings yet.</p>
                      <button onClick={() => setView('booking')} className="mt-4 text-gold hover:text-gold-light font-semibold uppercase tracking-wider text-sm">
                        Book a Room Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
