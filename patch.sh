#!/bin/bash
cat << 'INNER_EOF' > rep.txt
    if (authMode === 'signup') {
      if (!name || !email || !phone || !password || !confirmPassword) {
INNER_EOF
sed -i -e '/}    }      if (!name || !email || !phone || !password || !confirmPassword) {/c\' -e "$(cat rep.txt | sed 's/$/\\/')" src/components/Login.tsx
