import React, { useState } from 'react';
import { ViewState } from '../App';
import { User, Lock, Mail, Phone } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../lib/firebase';

export default function Login({ setView }: { setView: (v: ViewState) => void }) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (authMode === 'forgot') {
      if (email) {
        setSuccess('Password reset link sent to your email.');
      } else {
        setError('Please enter your email address');
      }
      return;
    }

    if (authMode === 'signup') {
      if (!name || !email || !phone || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        import('firebase/auth').then(({ updateProfile }) => {
          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: name
            }).catch(console.error);
          }
        });
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);
        setView('home');
      } catch (err: any) {
        setError(err.message || 'Failed to create account');
      }
      return;
    }
    
    // Admin login check
    if (authMode === 'login' && email.toLowerCase() === 'yahye' && password === '123') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('isLoggedIn', 'true');
      setView('admin');
      return;
    }
    
    // Normal user login
    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.removeItem('isAdmin');
        if (!localStorage.getItem('userName')) {
          localStorage.setItem('userName', userCredential.user.displayName || 'Guest User');
        }
        localStorage.setItem('userEmail', userCredential.user.email || '');
        setView('home');
      } catch (err: any) {
        setError(err.message || 'Invalid email or password');
      }
    } else {
      setError('Please fill in all fields');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', result.user.displayName || 'Google User');
      localStorage.setItem('userEmail', result.user.email || '');
      localStorage.setItem('userPhoto', result.user.photoURL || '');
      setView('home');
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    }
  };

  return (
    <div className="min-h-screen bg-hotel-darker flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Background visual */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1542314831-c6a4d140b627?auto=format&fit=crop&w=1920&q=80" 
          alt="Bg" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center mb-6">
          <span className="text-gold text-4xl font-bold font-['Playfair_Display'] tracking-wider">SOMALI</span>
        </div>
        <h2 className="mt-2 text-center text-2xl font-['Playfair_Display'] text-white">
          {authMode === 'signup' ? 'Create your account' : authMode === 'forgot' ? 'Reset your password' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10">
          <form className="space-y-6" onSubmit={handleAuth}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-sm text-sm">
                {success}
              </div>
            )}
            
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required={authMode === 'signup'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 block w-full py-3 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm rounded-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      required={authMode === 'signup'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 block w-full py-3 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm rounded-sm"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {authMode === 'login' ? 'Email address or Username' : 'Email address'}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full py-3 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm rounded-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {authMode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required={authMode !== 'forgot'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full py-3 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm rounded-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {authMode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required={authMode === 'signup'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 block w-full py-3 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold sm:text-sm rounded-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {authMode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button type="button" onClick={() => setAuthMode('forgot')} className="font-medium text-gold-dark hover:text-gold">
                    Forgot your password?
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-bold rounded-sm text-hotel-darker bg-gold hover:bg-gold-light focus:outline-none transition-colors uppercase tracking-wider"
              >
                {authMode === 'signup' ? 'Create Account' : authMode === 'forgot' ? 'Send Reset Link' : 'Sign in'}
              </button>
            </div>
          </form>

          {authMode !== 'forgot' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleAuth}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-sm shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors items-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {authMode === 'signup' ? 'Already have an account?' : authMode === 'forgot' ? 'Remember your password?' : "Don't have an account?"}
            </span>
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="ml-1 font-semibold text-gold-dark hover:text-gold transition-colors"
            >
              {authMode === 'signup' ? 'Sign in' : authMode === 'forgot' ? 'Sign in' : 'Create one'}
            </button>
          </div>

          <div className="mt-6 text-center">
             <button onClick={() => setView('home')} className="text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center w-full transition-colors">
               Continue as Guest
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
