const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

const oldCode = `    }
    }
      if (!name || !email || !phone || !password || !confirmPassword) {`;

const newCode = `    }

    if (authMode === 'signup') {
      if (!name || !email || !phone || !password || !confirmPassword) {`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/components/Login.tsx', code);
