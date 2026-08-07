import React, { useState } from 'react';
import { ViewState } from '../App';
import { Check, Calendar, Users, Tv, Wifi, Coffee, Download, ArrowLeft } from 'lucide-react';

import { ROOMS } from '../data';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export default function Booking({ setView }: { setView: (v: ViewState) => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    checkIn: '',
    checkOut: '',
    adults: '1',
    children: '0',
    roomType: 'Standard Room',
    rooms: '1',
    requests: '',
    promo: ''
  });

  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const selectRoomAndNext = (room: any) => {
    setSelectedRoom(room);
    handleNext();
  };

  const handlePayment = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to book.");
      return;
    }
    
    setIsSubmitting(true);
    
    const totalAmount = parseFloat(((selectedRoom?.price || 120) * 3 * 1.1).toFixed(0));
    const payload = {
      userId: auth.currentUser.uid,
      fullName: formData.fullName || 'Guest',
      email: formData.email || auth.currentUser.email || '',
      phone: formData.phone || '00000000',
      nationality: formData.nationality || 'Somalia',
      checkIn: formData.checkIn || '12 Aug 2026',
      checkOut: formData.checkOut || '15 Aug 2026',
      adults: parseInt(formData.adults),
      children: parseInt(formData.children),
      roomType: selectedRoom?.name || formData.roomType,
      rooms: parseInt(formData.rooms),
      requests: formData.requests || '',
      promo: formData.promo || '',
      totalAmount,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'bookings'), payload);
      setBookingId(docRef.id);
      handleNext();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'bookings');
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 z-0"></div>
            {[
              { num: 1, label: 'Booking Details' },
              { num: 2, label: 'Choose Room' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Confirmation' }
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center bg-slate-50 px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${
                  step >= s.num ? 'bg-hotel-darker text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className={`text-xs font-semibold ${step >= s.num ? 'text-hotel-darker' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Booking Details */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-hotel-darker mb-2">Booking Details</h2>
            <p className="text-sm text-gray-500 mb-8">Please fill the form below to continue your booking</p>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nationality</label>
                <select name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm text-gray-600 appearance-none" required>
                  <option value="">Select nationality</option>
                  <option>Somalia</option>
                  <option>Kenya</option>
                  <option>Ethiopia</option>
                  <option>Djibouti</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Check-in Date</label>
                <div className="relative">
                  <input type="date" name="checkIn" value={formData.checkIn} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm" required />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Check-out Date</label>
                <div className="relative">
                  <input type="date" name="checkOut" value={formData.checkOut} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm" required />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Adults</label>
                <select name="adults" value={formData.adults} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm text-gray-600 appearance-none">
                  <option>1</option><option>2</option><option>3</option><option>4</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Children</label>
                <select name="children" value={formData.children} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm text-gray-600 appearance-none">
                  <option>0</option><option>1</option><option>2</option><option>3</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Room Type</label>
                <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm text-gray-600 appearance-none">
                  <option value="All Rooms">All Rooms</option>
                  {ROOMS.map(room => (
                    <option key={room.id} value={room.name}>{room.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Number of Rooms</label>
                <select name="rooms" value={formData.rooms} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm text-gray-600 appearance-none">
                  <option>1</option><option>2</option><option>3</option><option>4</option>
                </select>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Special Requests (Optional)</label>
                    <textarea name="requests" value={formData.requests} onChange={handleInputChange} placeholder="Write your request here..." rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm resize-none"></textarea>
                 </div>
                 <div className="flex flex-col justify-end">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Promo Code (Optional)</label>
                    <div className="flex">
                      <input type="text" name="promo" value={formData.promo} onChange={handleInputChange} placeholder="Enter promo code" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gold text-sm rounded-l-sm" />
                      <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 font-bold text-sm transition-colors rounded-r-sm">Apply</button>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button type="submit" className="bg-gold hover:bg-gold-light text-hotel-darker px-8 py-3 font-bold uppercase tracking-wider text-sm transition-colors rounded-sm">
                        CONTINUE TO ROOM
                      </button>
                    </div>
                 </div>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Choose Room */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-hotel-darker mb-2">Choose Your Room</h2>
                <p className="text-sm text-gray-500">Select a room that best suits your needs</p>
              </div>
              <button onClick={handlePrev} className="flex items-center text-sm font-semibold text-gray-500 hover:text-hotel-darker">
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>
            </div>
            
            <div className="space-y-6">
              {ROOMS.map(room => (
                <div key={room.id} className="flex flex-col md:flex-row border border-gray-100 p-4 rounded-sm hover:shadow-md transition-shadow">
                  <img src={room.image} alt={room.name} className="w-full md:w-64 h-40 object-cover rounded-sm mb-4 md:mb-0 md:mr-6" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-hotel-darker">{room.name}</h3>
                        <div className="text-right">
                          <span className="text-lg font-bold text-hotel-darker">${room.price}</span>
                          <span className="text-xs text-gray-500"> / Night</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{room.desc}</p>
                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600">
                        {room.amenities.map(am => (
                          <span key={am} className="flex items-center">
                            {am === 'Wi-Fi' && <Wifi size={14} className="mr-1 text-gray-400" />}
                            {am === 'TV' && <Tv size={14} className="mr-1 text-gray-400" />}
                            {am === 'Breakfast' && <Coffee size={14} className="mr-1 text-gray-400" />}
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 md:mt-0">
                      <button onClick={() => selectRoomAndNext(room)} className="bg-gold hover:bg-gold-light text-hotel-darker px-8 py-2 font-bold text-sm transition-colors rounded-sm">
                        SELECT
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-hotel-darker mb-4 border-b border-gray-100 pb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-semibold text-hotel-darker">{formData.checkIn || '12 Aug 2026'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span className="font-semibold text-hotel-darker">{formData.checkOut || '15 Aug 2026'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Nights</span><span className="font-semibold text-hotel-darker">3 Nights</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Room Type</span><span className="font-semibold text-hotel-darker">{selectedRoom?.name || 'Deluxe Room'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Guests</span><span className="font-semibold text-hotel-darker">{formData.adults} Adults, {formData.children} Child</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rooms</span><span className="font-semibold text-hotel-darker">{formData.rooms} Room</span></div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Price per Night</span><span className="font-semibold text-hotel-darker">${selectedRoom?.price || 120}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal (3 Nights)</span><span className="font-semibold text-hotel-darker">${(selectedRoom?.price || 120) * 3}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Taxes & Fees (10%)</span><span className="font-semibold text-hotel-darker">${((selectedRoom?.price || 120) * 3 * 0.1).toFixed(0)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="font-semibold text-hotel-darker">-$0</span></div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-hotel-darker">Grand Total</span>
                  <span className="text-2xl font-bold text-gold-dark">${((selectedRoom?.price || 120) * 3 * 1.1).toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-hotel-darker">Payment Method</h3>
                  <button onClick={handlePrev} className="flex items-center text-sm font-semibold text-gray-500 hover:text-hotel-darker">
                    <ArrowLeft size={16} className="mr-1" /> Back
                  </button>
                </div>
                
                <div className="space-y-4 mb-8">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-gold focus:ring-gold" />
                      <span className="ml-3 font-semibold text-gray-800">EVC Plus</span>
                    </div>
                    <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded">EVC</span>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input type="radio" name="payment" className="w-4 h-4 text-gold focus:ring-gold" />
                      <span className="ml-3 font-semibold text-gray-800">Zaad Service</span>
                    </div>
                    <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded">ZAAD</span>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input type="radio" name="payment" className="w-4 h-4 text-gold focus:ring-gold" />
                      <span className="ml-3 font-semibold text-gray-800">Sahal</span>
                    </div>
                    <span className="text-blue-600 font-bold text-sm bg-blue-100 px-2 py-1 rounded">Sahal</span>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input type="radio" name="payment" className="w-4 h-4 text-gold focus:ring-gold" />
                      <span className="ml-3 font-semibold text-gray-800">Visa Card</span>
                    </div>
                    <span className="text-blue-800 font-bold text-sm bg-blue-50 px-2 py-1 rounded border border-blue-200">VISA</span>
                  </label>
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center">
                      <input type="radio" name="payment" className="w-4 h-4 text-gold focus:ring-gold" />
                      <span className="ml-3 font-semibold text-gray-800">Mastercard</span>
                    </div>
                    <span className="flex"><div className="w-4 h-4 rounded-full bg-red-500 opacity-80 mix-blend-multiply"></div><div className="w-4 h-4 rounded-full bg-yellow-500 opacity-80 mix-blend-multiply -ml-2"></div></span>
                  </label>
                </div>
                
                <button 
                  onClick={handlePayment} 
                  disabled={isSubmitting}
                  className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-gold hover:bg-gold-light'} text-hotel-darker py-4 font-bold text-lg uppercase tracking-wider transition-colors rounded-sm`}
                >
                  {isSubmitting ? 'PROCESSING...' : `PAY $${((selectedRoom?.price || 120) * 3 * 1.1).toFixed(0)}`}
                </button>
                <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-400 font-semibold">
                  <span className="flex items-center"><Check size={14} className="mr-1 text-green-500"/> Secure Payment</span>
                  <span className="flex items-center"><Check size={14} className="mr-1 text-green-500"/> SSL Encrypted</span>
                  <span className="flex items-center"><Check size={14} className="mr-1 text-green-500"/> Your data is safe</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-sm shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-hotel-darker mb-2">Thank You!</h2>
            <p className="text-gray-500 mb-8">Your booking has been confirmed.</p>
            
            <div className="bg-gray-50 p-6 rounded-sm text-left mb-8 space-y-4">
              <div className="flex justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-500 text-sm font-semibold">Booking ID</span>
                <span className="font-bold text-hotel-darker">{bookingId || 'HMU...'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-semibold">Guest Name</span>
                <span className="font-bold text-hotel-darker">{formData.fullName || 'Abdi Ahmed Hassan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-semibold">Room Type</span>
                <span className="font-bold text-hotel-darker">{selectedRoom?.name || 'Deluxe Room'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-semibold">Check-in Date</span>
                <span className="font-bold text-hotel-darker">{formData.checkIn || '12 Aug 2026'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-semibold">Check-out Date</span>
                <span className="font-bold text-hotel-darker">{formData.checkOut || '15 Aug 2026'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-semibold">Total Amount</span>
                <span className="font-bold text-hotel-darker">${((selectedRoom?.price || 120) * 3 * 1.1).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-semibold">Payment Status</span>
                <span className="font-bold text-green-600">Paid</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-8">A confirmation email has been sent to your email.</p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="flex items-center justify-center px-6 py-3 border border-hotel-darker text-hotel-darker font-bold text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-sm">
                <Download size={18} className="mr-2" /> Download Receipt
              </button>
              <button onClick={() => setView('home')} className="flex items-center justify-center px-6 py-3 bg-gold hover:bg-gold-light text-hotel-darker font-bold text-sm uppercase tracking-wider transition-colors rounded-sm">
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
