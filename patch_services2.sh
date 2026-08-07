#!/bin/bash
sed -i '5,42d' src/components/Services.tsx
sed -i 's/{ icon: Utensils, name: .Restaurant & Dining.* },//g' src/components/Services.tsx
