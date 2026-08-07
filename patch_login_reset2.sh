#!/bin/bash
cat << 'INNER_EOF' > replacement2.txt
    if (authMode === 'forgot') {
      if (email) {
        try {
          await sendPasswordResetEmail(auth, email);
          setSuccess('Password reset link sent to your email.');
        } catch (err: any) {
          setError(err.message || 'Failed to send reset email');
        }
      } else {
        setError('Please enter your email address');
      }
      return;
    }
INNER_EOF
sed -i -e '/if (authMode === .forgot.) {/,/return;/c\' -e "$(cat replacement2.txt | sed 's/$/\\/')" src/components/Login.tsx
