import React, { useState, useEffect } from 'react';
import { ViewState } from '../App';
import { LogOut, LayoutDashboard, Calendar, BedDouble, Users, CreditCard, MessageSquare, FileText, Settings, UserCircle, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
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

const dataRevenue = [
  { name: 'Room Bookings', value: 12000, color: '#1e3a8a' },
  { name: 'Other Services', value: 3500, color: '#f59e0b' },
  { name: 'Restaurant', value: 2000, color: '#10b981' },
  { name: 'Others', value: 500, color: '#6b7280' },
];

export default function Admin({ setView }: { setView: (v: ViewState) => void }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [roomFormData, setRoomFormData] = useState({ name: '', price: '', status: 'Available', image: '' });

  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribeBookings = onSnapshot(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')), (snapshot) => {
      const bks: any[] = [];
      snapshot.forEach(doc => bks.push({ id: doc.id, ...doc.data() }));
      setBookings(bks);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    });

    const unsubscribeRooms = onSnapshot(query(collection(db, 'rooms'), orderBy('createdAt', 'desc')), (snapshot) => {
      const rms: any[] = [];
      snapshot.forEach(doc => rms.push({ id: doc.id, ...doc.data() }));
      setRooms(rms);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'rooms');
      setLoading(false);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeRooms();
    };
  }, []);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${id}`);
      alert("Failed to update status.");
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoomId) {
        await updateDoc(doc(db, 'rooms', editingRoomId), {
          ...roomFormData,
          price: Number(roomFormData.price),
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'rooms'), {
          ...roomFormData,
          price: Number(roomFormData.price),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setShowRoomForm(false);
      setEditingRoomId(null);
      setRoomFormData({ name: '', price: '', status: 'Available', image: '' });
    } catch (err) {
      handleFirestoreError(err, editingRoomId ? OperationType.UPDATE : OperationType.CREATE, 'rooms');
      alert("Failed to save room.");
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteDoc(doc(db, 'rooms', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `rooms/${id}`);
      alert("Failed to delete room.");
    }
  };

  const totalRevenue = bookings.filter(b => b.status === 'confirmed').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  const dataBookings = [
    { name: 'Mon', bookings: 2 },
    { name: 'Tue', bookings: 5 },
    { name: 'Wed', bookings: 3 },
    { name: 'Thu', bookings: 8 },
    { name: 'Fri', bookings: 12 },
    { name: 'Sat', bookings: 15 },
    { name: 'Sun', bookings: bookings.length },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    setView('login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-['Inter']">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f172a] text-white flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-800">
          <div className="text-gold text-2xl font-bold font-['Playfair_Display'] tracking-wider mb-1 cursor-pointer" onClick={() => setView('home')}>SOMALI HOTEL</div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Dashboard</div>
          <nav className="space-y-1">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Bookings', icon: Calendar },
              { name: 'Rooms', icon: BedDouble },
              { name: 'Customers', icon: Users },
              { name: 'Payments', icon: CreditCard },
              { name: 'Messages', icon: MessageSquare },
              { name: 'Reports', icon: FileText },
              { name: 'Settings', icon: Settings },
            ].map(item => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center px-6 py-3 text-sm font-semibold transition-colors ${activeTab === item.name ? 'bg-gray-800 text-white border-l-4 border-gold' : 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'}`}
              >
                <item.icon size={18} className="mr-3" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button onClick={() => setView('home')} className="w-full flex items-center px-2 py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            <XCircle size={18} className="mr-3" /> Cancel
          </button>
          <button onClick={handleLogout} className="w-full flex items-center px-2 py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            <LogOut size={18} className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-[#1e293b] h-16 flex items-center justify-between px-8 text-white border-b border-gray-800 sticky top-0 z-10">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <UserCircle size={28} className="text-gold cursor-pointer" />
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0f172a] text-white">
          {activeTab === 'Dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Total Bookings</h3>
                  <div className="text-3xl font-bold text-white mb-2">{bookings.length}</div>
                  <div className="text-xs text-gray-500 font-semibold">Updated just now</div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Total Revenue</h3>
                  <div className="text-3xl font-bold text-white mb-2">${totalRevenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 font-semibold">From confirmed bookings</div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Rooms</h3>
                  <div className="text-3xl font-bold text-white mb-2">{rooms.length}</div>
                  <div className="text-xs text-gray-400 font-semibold">All rooms</div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Pending</h3>
                  <div className="text-3xl font-bold text-white mb-2">{pendingBookings}</div>
                  <div className="text-xs text-gray-500 font-semibold">Requires action</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800 lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-300 mb-6">Bookings Overview</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dataBookings} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                        <Line type="monotone" dataKey="bookings" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800 flex flex-col">
                  <h3 className="text-sm font-bold text-gray-300 mb-6">Revenue Overview</h3>
                  <div className="h-48 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dataRevenue}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dataRevenue.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-lg font-bold text-white">$0</span>
                      <span className="text-xs text-gray-400">Total</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2 text-xs h-full justify-center">
                    {dataRevenue.map((item, i) => (
                      <div key={i} className="flex items-center text-gray-400">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="flex-1">{item.name}</span>
                        <span className="font-semibold text-white ml-2">${item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="bg-[#1e293b] rounded shadow-sm border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-sm font-bold text-gray-300">Recent Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-[#0f172a]">
                      <tr>
                        <th className="px-6 py-3 font-semibold">ID</th>
                        <th className="px-6 py-3 font-semibold">Guest Name</th>
                        <th className="px-6 py-3 font-semibold">Room Type</th>
                        <th className="px-6 py-3 font-semibold">Check-in</th>
                        <th className="px-6 py-3 font-semibold">Check-out</th>
                        <th className="px-6 py-3 font-semibold">Amount</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                        <th className="px-6 py-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                            Loading bookings...
                          </td>
                        </tr>
                      ) : bookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                            No recent bookings available.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-800 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-mono">{booking.id.substring(0, 8)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap font-semibold">{booking.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{booking.roomType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{booking.checkIn}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{booking.checkOut}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">${booking.totalAmount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                                booking.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                                'bg-yellow-900 text-yellow-300'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                {booking.status === 'pending' && (
                                  <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="p-1 hover:text-green-400 transition-colors" title="Confirm">
                                    <CheckCircle size={18} />
                                  </button>
                                )}
                                {booking.status !== 'cancelled' && (
                                  <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="p-1 hover:text-red-400 transition-colors" title="Cancel">
                                    <XCircle size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Bookings' && (
            <div className="bg-[#1e293b] rounded shadow-sm border border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-300">All Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-[#0f172a]">
                    <tr>
                      <th className="px-6 py-3 font-semibold">ID</th>
                      <th className="px-6 py-3 font-semibold">Guest Name</th>
                      <th className="px-6 py-3 font-semibold">Room Type</th>
                      <th className="px-6 py-3 font-semibold">Check-in</th>
                      <th className="px-6 py-3 font-semibold">Check-out</th>
                      <th className="px-6 py-3 font-semibold">Amount</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          Loading bookings...
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                          No bookings available.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-mono">{booking.id.substring(0, 8)}...</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">{booking.fullName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.roomType}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.checkIn}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.checkOut}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">${booking.totalAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed' ? 'bg-green-900 text-green-300' :
                              booking.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                              'bg-yellow-900 text-yellow-300'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              {booking.status === 'pending' && (
                                <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="p-1 hover:text-green-400 transition-colors" title="Confirm">
                                  <CheckCircle size={18} />
                                </button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <button onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="p-1 hover:text-red-400 transition-colors" title="Cancel">
                                  <XCircle size={18} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Rooms' && (
            <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Rooms Management</h2>
                <button 
                  onClick={() => {
                    setEditingRoomId(null);
                    setRoomFormData({ name: '', price: '', status: 'Available', image: '' });
                    setShowRoomForm(!showRoomForm);
                  }}
                  className="bg-gold text-hotel-darker px-4 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-gold-light transition-colors"
                >
                  {showRoomForm ? 'Cancel' : 'Add New Room'}
                </button>
              </div>
              <p className="text-gray-400 mb-6">List of rooms and their current statuses.</p>
              
              {showRoomForm && (
                <div className="bg-[#0f172a] p-6 rounded mb-8 border border-gray-800">
                  <h3 className="text-lg font-semibold text-gold mb-4">{editingRoomId ? 'Edit Room' : 'Add New Room'}</h3>
                  <form onSubmit={handleSaveRoom} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Room Name</label>
                        <input 
                          type="text" 
                          required
                          value={roomFormData.name}
                          onChange={(e) => setRoomFormData({...roomFormData, name: e.target.value})}
                          className="w-full bg-[#1e293b] border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                          placeholder="e.g., Deluxe Suite"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Price per Night ($)</label>
                        <input 
                          type="number" 
                          required
                          value={roomFormData.price}
                          onChange={(e) => setRoomFormData({...roomFormData, price: e.target.value})}
                          className="w-full bg-[#1e293b] border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                          placeholder="e.g., 150"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Status</label>
                        <select
                          value={roomFormData.status}
                          onChange={(e) => setRoomFormData({...roomFormData, status: e.target.value})}
                          className="w-full bg-[#1e293b] border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                        <input 
                          type="url" 
                          value={roomFormData.image}
                          onChange={(e) => setRoomFormData({...roomFormData, image: e.target.value})}
                          className="w-full bg-[#1e293b] border border-gray-700 rounded px-4 py-2 text-white focus:border-gold focus:outline-none"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>
                    <button type="submit" className="bg-gold text-hotel-darker px-6 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-gold-light transition-colors mt-4">
                      Save Room
                    </button>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.length === 0 ? (
                  <p className="text-gray-400 col-span-full">No rooms found. Add some rooms to get started.</p>
                ) : (
                  rooms.map((room) => (
                    <div key={room.id} className="bg-[#0f172a] border border-gray-800 rounded flex flex-col overflow-hidden">
                      {room.image && (
                        <div className="h-40 w-full bg-gray-800">
                          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-gold mb-2">{room.name}</h3>
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-gray-400">Status:</span>
                          <span className={`${
                            room.status === 'Available' ? 'text-green-400 bg-green-400/10' : 
                            room.status === 'Occupied' ? 'text-red-400 bg-red-400/10' : 
                            'text-yellow-400 bg-yellow-400/10'
                          } px-2 py-1 rounded text-xs font-medium`}>
                            {room.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-4">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white font-semibold">${room.price}/night</span>
                        </div>
                        <div className="mt-auto grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => {
                              setRoomFormData({ name: room.name || '', price: String(room.price || ''), status: room.status || 'Available', image: room.image || '' });
                              setEditingRoomId(room.id);
                              setShowRoomForm(true);
                            }}
                            className="py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteRoom(room.id)}
                            className="py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'Customers' && (
            <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Customers Directory</h2>
              <p className="text-gray-400 mb-6">Manage customer profiles and booking history.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-[#0f172a]">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Name</th>
                      <th className="px-6 py-3 font-semibold">Email</th>
                      <th className="px-6 py-3 font-semibold">Phone</th>
                      <th className="px-6 py-3 font-semibold">Total Bookings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {Array.from(new Set(bookings.map(b => b.email))).map((email, i) => {
                      const customerBookings = bookings.filter(b => b.email === email);
                      const customer = customerBookings[0];
                      return (
                        <tr key={i} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-semibold">{customer.fullName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="bg-gray-700 px-2 py-1 rounded text-xs">{customerBookings.length}</span>
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No customers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Payments' && (
            <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Payments & Transactions</h2>
              <p className="text-gray-400 mb-6">View recent payments and invoices.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-[#0f172a]">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Transaction ID</th>
                      <th className="px-6 py-3 font-semibold">Date</th>
                      <th className="px-6 py-3 font-semibold">Customer</th>
                      <th className="px-6 py-3 font-semibold">Amount</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {bookings.filter(b => b.status === 'confirmed').map((booking, i) => (
                      <tr key={i} className="hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono">TXN-{booking.id.substring(0, 8).toUpperCase()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{(booking.updatedAt?.toDate ? booking.updatedAt.toDate() : new Date()).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{booking.fullName}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">${booking.totalAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-300">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                    {bookings.filter(b => b.status === 'confirmed').length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No recent transactions.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Messages' && (
            <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Messages & Inquiries</h2>
              <p className="text-gray-400 mb-6">Customer messages and support requests.</p>
              <div className="flex items-center justify-center py-12 text-gray-500">
                No new messages at this time.
              </div>
            </div>
          )}

          {activeTab === 'Reports' && (
            <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Analytics & Reports</h2>
              <p className="text-gray-400 mb-6">Generate and view detailed reports.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="bg-[#0f172a] border border-gray-800 hover:border-gold transition-colors p-4 rounded text-left flex flex-col">
                  <span className="font-semibold text-white mb-1">Monthly Revenue</span>
                  <span className="text-xs text-gray-400">Download PDF</span>
                </button>
                <button className="bg-[#0f172a] border border-gray-800 hover:border-gold transition-colors p-4 rounded text-left flex flex-col">
                  <span className="font-semibold text-white mb-1">Occupancy Rates</span>
                  <span className="text-xs text-gray-400">Download Excel</span>
                </button>
                <button className="bg-[#0f172a] border border-gray-800 hover:border-gold transition-colors p-4 rounded text-left flex flex-col">
                  <span className="font-semibold text-white mb-1">Guest Demographics</span>
                  <span className="text-xs text-gray-400">Download CSV</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="bg-[#1e293b] p-6 rounded shadow-sm border border-gray-800">
              <h2 className="text-xl font-bold mb-4">System Settings</h2>
              <p className="text-gray-400 mb-6">Configure hotel parameters and admin preferences.</p>
              
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Hotel Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Hotel Name" defaultValue="Somali Hotel" className="w-full bg-[#0f172a] border border-gray-700 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-gold" />
                    <input type="text" placeholder="Contact Email" defaultValue="info@somalihotel.com" className="w-full bg-[#0f172a] border border-gray-700 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-gold" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Notifications</h3>
                  <label className="flex items-center space-x-3 text-sm text-gray-400">
                    <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-gold rounded border-gray-700 bg-[#0f172a] focus:ring-gold" />
                    <span>Email notifications for new bookings</span>
                  </label>
                </div>
                
                <button className="px-6 py-2 bg-gold hover:bg-gold-light text-hotel-darker font-bold uppercase tracking-wider rounded-sm text-sm transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
