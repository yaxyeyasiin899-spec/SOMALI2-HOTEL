const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

const targetBtn = `            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-bold rounded-sm text-hotel-darker bg-gold hover:bg-gold-light focus:outline-none transition-colors uppercase tracking-wider"
              >
                {authMode === 'signup' ? 'Create Account' : authMode === 'forgot' ? 'Send Reset Link' : 'Sign in'}
              </button>
            </div>`;

const newBtn = `            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-bold rounded-sm text-hotel-darker bg-gold hover:bg-gold-light focus:outline-none transition-colors uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : authMode === 'signup' ? 'Create Account' : authMode === 'forgot' ? 'Send Reset Link' : 'Sign in'}
              </button>
            </div>`;

code = code.replace(targetBtn, newBtn);
fs.writeFileSync('src/components/Login.tsx', code);
