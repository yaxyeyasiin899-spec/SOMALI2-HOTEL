const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

const regex = /const handleAuth = async \(e: React\.FormEvent\) => \{[\s\S]*?\/\/ Normal user login/;

const newCode = `const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (authMode === 'forgot') {
      if (email) {
        setIsLoading(true);
        try {
          await sendPasswordResetEmail(auth, email);
          setSuccess('Link-ga dib loogu cusboonaysiinayo password-ka waxaa loo diray email-kaaga. Fadlan eeg Inbox-ka iyo Spam/Junk.');
        } catch (err: any) {
          if (err.code === 'auth/user-not-found') {
            setError('Email-kan account laguma diiwaangelin.');
          } else if (err.code === 'auth/invalid-email') {
            setError('Fadlan geli email sax ah.');
          } else if (err.code === 'auth/too-many-requests') {
            setError('Codsi xad dhaaf ah. Fadlan waxyar kadib isku day markale.');
          } else if (err.code === 'auth/unauthorized-domain') {
            setError('Domain-kan looma oggola. Fadlan ku dar Firebase Console -> Authentication -> Settings -> Authorized domains.');
          } else {
            setError(err.message || 'Khalad ayaa dhacay. Fadlan isku day markale.');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('Fadlan geli email-kaaga.');
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
    
    // Normal user login`;

if (code.match(regex)) {
  code = code.replace(regex, newCode);
  fs.writeFileSync('src/components/Login.tsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("Regex didn't match.");
}
