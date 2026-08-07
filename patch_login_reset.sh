#!/bin/bash
sed -i 's/import { db, auth, googleProvider/import { db, auth, googleProvider, sendPasswordResetEmail/' src/components/Login.tsx
