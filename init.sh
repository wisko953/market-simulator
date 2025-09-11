#!/bin/bash

echo "Protection des fichiers sensibles..."

# Renommer les fichiers existants
[ -f index.html ] && mv index.html index_backup.html
[ -f style.css ] && mv style.css style_backup.css
[ -d src ] && mv src src_backup

echo "Initialisation du projet Vite..."
npm create vite@latest . -- --template vanilla-ts
npm install

echo "Suppression des fichiers générés par Vite..."
[ -f index.html ] && rm index.html
[ -f style.css ] && rm style.css
[ -d src ] && rm -rf src

echo "Restauration des fichiers originaux..."
[ -f index_backup.html ] && mv index_backup.html index.html
[ -f style_backup.css ] && mv style_backup.css style.css
[ -d src_backup ] && mv src_backup src

echo "✅ Projet Vite initialisé avec votre code existant."

# Installer les dépendances du projet
cd market-simulator || exit
npm install

# Lancer le serveur de développement
npm run dev
