#!/bin/bash
cat << 'INNER_EOF' > forgot_replacement.txt
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
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
INNER_EOF
sed -i -e '/const handleAuth = async (e: React.FormEvent) => {/,/return;/c\' -e "$(cat forgot_replacement.txt | sed 's/$/\\/')" src/components/Login.tsx
