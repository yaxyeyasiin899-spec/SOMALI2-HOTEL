#!/bin/bash
cat << 'INNER_EOF' > btn_replacement.txt
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-bold rounded-sm text-hotel-darker bg-gold hover:bg-gold-light focus:outline-none transition-colors uppercase tracking-wider disabled:opacity-70"
              >
                {isLoading ? 'Sending...' : authMode === 'signup' ? 'Create Account' : authMode === 'forgot' ? 'Send Reset Link' : 'Sign in'}
              </button>
            </div>
INNER_EOF
sed -i -e '/<div>/,/<\/div>/!b' -e '/<button/,/<\/button>/!b' -e '/type="submit"/!b' -e '/{authMode === '\''signup'\'' ? '\''Create Account'\'' : authMode === '\''forgot'\'' ? '\''Send Reset Link'\'' : '\''Sign in'\''}/!b' -e '/<div>/,/<\/div>/c\' -e "$(cat btn_replacement.txt | sed 's/$/\\/')" src/components/Login.tsx
